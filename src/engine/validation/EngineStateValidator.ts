import type { EngineState } from "../save/EngineState.js";
import type { Competition } from "../competition/Competition.js";
import type { SeasonState } from "../competition/SeasonState.js";

import { Team } from "../teams/Team.js";
import { Organization } from "../orgs/Organization.js";
import { Contract } from "../contracts/Contract.js";
import { Season } from "../competition/Season.js";
import { Fixture } from "../competition/Fixture.js";
import { GameEvent } from "../events/GameEvent.js";

export function validateEngineState(state: EngineState): void {
    validateSave(state);
    validateLocalEntities(state);
    validateUniqueIds(state);
    validatePeople(state);
    validateTeams(state);
    validateOrganizations(state);
    validateContracts(state);
    validateContractOffers(state);
    validateCompetitions(state);
    validateSeasons(state);
    validateFixtures(state);
    validateFixtureResults(state);
    validateEvents(state);
    validateCareerRecords(state);
    validateContractOverlaps(state);
}

function validateSave(state: EngineState): void {
    const { save } = state;

    assertNonEmpty(save.id, "Save id");
    assertNonEmpty(save.name, "Save name");
    assertNonEmpty(save.schemaVersion, "Save schemaVersion");
    assertNonEmpty(save.rulesVersion, "Save rulesVersion");
    assertNonEmpty(save.rulesetId, "Save rulesetId");

    if (!Number.isInteger(save.seed)) {
        throw new Error("Save seed must be an integer");
    }

    if (
        !Number.isInteger(save.rngState) ||
        save.rngState < 0 ||
        save.rngState > 0xffffffff
    ) {
        throw new Error("Save rngState must be an unsigned 32-bit integer");
    }

    if (Number.isNaN(Date.parse(save.currentDate))) {
        throw new Error("Save currentDate must be a valid date");
    }
}

function validateLocalEntities(state: EngineState): void {
    for (const team of state.teams) {
        new Team(team);
    }

    for (const organization of state.organizations) {
        new Organization(organization);
    }

    for (const contract of state.contracts) {
        new Contract(contract);
    }

    for (const season of state.seasons) {
        new Season(season);
    }

    for (const fixture of state.fixtures) {
        new Fixture(fixture);
    }

    for (const event of state.events) {
        new GameEvent(event);
    }
}

function validateUniqueIds(state: EngineState): void {
    assertUniqueIds("people", state.people);
    assertUniqueIds("teams", state.teams);
    assertUniqueIds("organizations", state.organizations);
    assertUniqueIds("contracts", state.contracts);
    assertUniqueIds("contractOffers", state.contractOffers);
    assertUniqueIds("competitions", state.competitions);
    assertUniqueIds("seasons", state.seasons);
    assertUniqueIds("fixtures", state.fixtures);
    assertUniqueIds("fixtureResults", state.fixtureResults);
    assertUniqueIds("events", state.events);
    assertUniqueIds("careerRecords", state.careerRecords);
}

function validatePeople(state: EngineState): void {
    const personIds = new Set<string>();

    for (const person of state.people) {
        assertNonEmpty(person.id, "Person id");
        assertNonEmpty(person.displayName, `Person ${person.id} displayName`);
        personIds.add(person.id);
    }

    const playerStatePersonIds = new Set<string>();

    for (const playerState of state.playerStates) {
        if (!personIds.has(playerState.personId)) {
            throw new Error(
                `PlayerState references unknown person ${playerState.personId}`
            );
        }

        if (playerStatePersonIds.has(playerState.personId)) {
            throw new Error(
                `Person ${playerState.personId} has multiple PlayerStates`
            );
        }

        validatePlayerMetric(playerState.morale, "morale", playerState.personId);
        validatePlayerMetric(playerState.fatigue, "fatigue", playerState.personId);
        validatePlayerMetric(
            playerState.confidence,
            "confidence",
            playerState.personId
        );

        playerStatePersonIds.add(playerState.personId);
    }
}

function validateTeams(state: EngineState): void {
    const personIds = new Set(state.people.map((person) => person.id));

    for (const team of state.teams) {
        for (const playerId of team.playerIds) {
            if (!personIds.has(playerId)) {
                throw new Error(
                    `Team ${team.id} references unknown person ${playerId}`
                );
            }
        }
    }
}

function validateOrganizations(state: EngineState): void {
    const teamIds = new Set(state.teams.map((team) => team.id));
    const ownerByTeamId = new Map<string, string>();

    for (const organization of state.organizations) {
        for (const teamId of organization.teamIds) {
            if (!teamIds.has(teamId)) {
                throw new Error(
                    `Organization ${organization.id} references unknown team ${teamId}`
                );
            }

            const currentOwner = ownerByTeamId.get(teamId);

            if (currentOwner !== undefined && currentOwner !== organization.id) {
                throw new Error(
                    `Team ${teamId} belongs to multiple organizations: ${currentOwner} and ${organization.id}`
                );
            }

            ownerByTeamId.set(teamId, organization.id);
        }
    }
}

function validateContracts(state: EngineState): void {
    const personIds = new Set(state.people.map((person) => person.id));
    const organizationIds = new Set(
        state.organizations.map((organization) => organization.id)
    );

    for (const contract of state.contracts) {
        if (!personIds.has(contract.personId)) {
            throw new Error(
                `Contract ${contract.id} references unknown person ${contract.personId}`
            );
        }

        if (!organizationIds.has(contract.organizationId)) {
            throw new Error(
                `Contract ${contract.id} references unknown organization ${contract.organizationId}`
            );
        }
    }
}

function validateContractOffers(state: EngineState): void {
    const personIds = new Set(state.people.map((person) => person.id));
    const organizationIds = new Set(
        state.organizations.map((organization) => organization.id)
    );

    for (const offer of state.contractOffers) {
        assertNonEmpty(offer.id, "ContractOffer id");

        if (!personIds.has(offer.personId)) {
            throw new Error(
                `ContractOffer ${offer.id} references unknown person ${offer.personId}`
            );
        }

        if (!organizationIds.has(offer.organizationId)) {
            throw new Error(
                `ContractOffer ${offer.id} references unknown organization ${offer.organizationId}`
            );
        }

        if (!Number.isFinite(offer.salary) || offer.salary < 0) {
            throw new Error(`ContractOffer ${offer.id} has an invalid salary`);
        }

        const startTime = Date.parse(offer.startDate);
        const endTime = Date.parse(offer.endDate);

        if (
            Number.isNaN(startTime) ||
            Number.isNaN(endTime) ||
            endTime <= startTime
        ) {
            throw new Error(`ContractOffer ${offer.id} has invalid dates`);
        }
    }
}

function validateCompetitions(state: EngineState): void {
    const teamIds = new Set(state.teams.map((team) => team.id));

    for (const competition of state.competitions) {
        assertNonEmpty(competition.id, "Competition id");
        assertNonEmpty(competition.name, `Competition ${competition.id} name`);

        if (competition.participantTeamIds.length < 2) {
            throw new Error(
                `Competition ${competition.id} must contain at least two teams`
            );
        }

        const uniqueParticipants = new Set(competition.participantTeamIds);

        if (uniqueParticipants.size !== competition.participantTeamIds.length) {
            throw new Error(
                `Competition ${competition.id} contains duplicate teams`
            );
        }

        for (const teamId of competition.participantTeamIds) {
            if (!teamIds.has(teamId)) {
                throw new Error(
                    `Competition ${competition.id} references unknown team ${teamId}`
                );
            }
        }
    }
}

function validateSeasons(state: EngineState): void {
    const competitionsById = new Map(
        state.competitions.map(
            (competition) => [competition.id, competition] as const
        )
    );
    const fixturesById = new Map(
        state.fixtures.map((fixture) => [fixture.id, fixture] as const)
    );

    for (const season of state.seasons) {
        const competition = competitionsById.get(season.competitionId);

        if (competition === undefined) {
            throw new Error(
                `Season ${season.id} references unknown competition ${season.competitionId}`
            );
        }

        for (const fixtureId of season.fixtureIds) {
            const fixture = fixturesById.get(fixtureId);

            if (fixture === undefined) {
                throw new Error(
                    `Season ${season.id} references unknown fixture ${fixtureId}`
                );
            }

            if (fixture.seasonId !== season.id) {
                throw new Error(
                    `Fixture ${fixture.id} does not belong to season ${season.id}`
                );
            }
        }

        if (season.championTeamId !== undefined) {
            if (!competition.participantTeamIds.includes(season.championTeamId)) {
                throw new Error(
                    `Season ${season.id} champion ${season.championTeamId} is not a competition participant`
                );
            }
        }

        if (season.status === "COMPLETED") {
            for (const fixtureId of season.fixtureIds) {
                const fixture = fixturesById.get(fixtureId);

                if (fixture === undefined || fixture.status !== "COMPLETED") {
                    throw new Error(
                        `Completed season ${season.id} contains an incomplete fixture ${fixtureId}`
                    );
                }
            }
        }
    }
}

function validateFixtures(state: EngineState): void {
    const seasonsById = new Map(
        state.seasons.map((season) => [season.id, season] as const)
    );
    const competitionsById = new Map(
        state.competitions.map(
            (competition) => [competition.id, competition] as const
        )
    );
    const teamIds = new Set(state.teams.map((team) => team.id));

    for (const fixture of state.fixtures) {
        const season = seasonsById.get(fixture.seasonId);

        if (season === undefined) {
            throw new Error(
                `Fixture ${fixture.id} references unknown season ${fixture.seasonId}`
            );
        }

        if (!season.fixtureIds.includes(fixture.id)) {
            throw new Error(
                `Season ${season.id} does not reference fixture ${fixture.id}`
            );
        }

        if (!teamIds.has(fixture.teamAId)) {
            throw new Error(
                `Fixture ${fixture.id} references unknown team ${fixture.teamAId}`
            );
        }

        if (!teamIds.has(fixture.teamBId)) {
            throw new Error(
                `Fixture ${fixture.id} references unknown team ${fixture.teamBId}`
            );
        }

        const competition = competitionsById.get(season.competitionId);

        if (competition === undefined) {
            throw new Error(
                `Fixture ${fixture.id} belongs to a season with an unknown competition`
            );
        }

        if (
            !competition.participantTeamIds.includes(fixture.teamAId) ||
            !competition.participantTeamIds.includes(fixture.teamBId)
        ) {
            throw new Error(
                `Fixture ${fixture.id} contains a team outside competition ${competition.id}`
            );
        }
    }
}

function validateFixtureResults(state: EngineState): void {
    const fixturesById = new Map(
        state.fixtures.map((fixture) => [fixture.id, fixture] as const)
    );
    const resultsById = new Map(
        state.fixtureResults.map((result) => [result.id, result] as const)
    );

    for (const result of state.fixtureResults) {
        assertNonEmpty(result.id, "FixtureResult id");
        assertNonEmpty(
            result.rulesetResultId,
            `FixtureResult ${result.id} rulesetResultId`
        );

        const fixture = fixturesById.get(result.fixtureId);

        if (fixture === undefined) {
            throw new Error(
                `FixtureResult ${result.id} references unknown fixture ${result.fixtureId}`
            );
        }

        if (fixture.status !== "COMPLETED") {
            throw new Error(
                `FixtureResult ${result.id} belongs to an incomplete fixture`
            );
        }

        if (fixture.resultId !== result.id) {
            throw new Error(
                `Fixture ${fixture.id} does not reference result ${result.id}`
            );
        }

        const participantIds = new Set(result.participantTeamIds);

        if (
            participantIds.size !== 2 ||
            !participantIds.has(fixture.teamAId) ||
            !participantIds.has(fixture.teamBId)
        ) {
            throw new Error(
                `FixtureResult ${result.id} participants do not match fixture ${fixture.id}`
            );
        }

        if (result.isDraw) {
            if (result.winnerTeamId !== undefined) {
                throw new Error(
                    `Drawn FixtureResult ${result.id} cannot have a winner`
                );
            }
        } else {
            if (result.winnerTeamId === undefined) {
                throw new Error(`FixtureResult ${result.id} must have a winner`);
            }

            if (!participantIds.has(result.winnerTeamId)) {
                throw new Error(
                    `FixtureResult ${result.id} winner is not a participant`
                );
            }
        }
    }

    for (const fixture of state.fixtures) {
        if (fixture.status !== "COMPLETED") {
            continue;
        }

        if (fixture.resultId === undefined) {
            throw new Error(`Completed fixture ${fixture.id} has no resultId`);
        }

        if (!resultsById.has(fixture.resultId)) {
            throw new Error(
                `Completed fixture ${fixture.id} references unknown result ${fixture.resultId}`
            );
        }
    }
}

function validateEvents(state: EngineState): void {
    for (const event of state.events) {
        if (event.saveId !== state.save.id) {
            throw new Error(`GameEvent ${event.id} belongs to another save`);
        }
    }
}

function validateCareerRecords(state: EngineState): void {
    const personIds = new Set(state.people.map((person) => person.id));
    const teamIds = new Set(state.teams.map((team) => team.id));
    const organizationIds = new Set(
        state.organizations.map((organization) => organization.id)
    );
    const seasonIds = new Set(state.seasons.map((season) => season.id));

    for (const record of state.careerRecords) {
        if (!seasonIds.has(record.seasonId)) {
            throw new Error(
                `CareerRecord ${record.id} references unknown season ${record.seasonId}`
            );
        }

        if (
            !Number.isInteger(record.games) ||
            !Number.isInteger(record.wins) ||
            !Number.isInteger(record.titles) ||
            record.games < 0 ||
            record.wins < 0 ||
            record.titles < 0 ||
            record.wins > record.games
        ) {
            throw new Error(`CareerRecord ${record.id} has invalid statistics`);
        }

        if (record.entityType === "PERSON" && !personIds.has(record.entityId)) {
            throw new Error(
                `CareerRecord ${record.id} references unknown person ${record.entityId}`
            );
        }

        if (record.entityType === "TEAM" && !teamIds.has(record.entityId)) {
            throw new Error(
                `CareerRecord ${record.id} references unknown team ${record.entityId}`
            );
        }

        if (
            record.entityType === "ORGANIZATION" &&
            !organizationIds.has(record.entityId)
        ) {
            throw new Error(
                `CareerRecord ${record.id} references unknown organization ${record.entityId}`
            );
        }
    }
}

function validateContractOverlaps(state: EngineState): void {
    const relevantContracts = state.contracts.filter(
        (contract) =>
            contract.status === "ACTIVE" || contract.status === "EXPIRING"
    );

    for (let i = 0; i < relevantContracts.length; i++) {
        const contractA = relevantContracts[i];

        if (contractA === undefined) {
            continue;
        }

        for (let j = i + 1; j < relevantContracts.length; j++) {
            const contractB = relevantContracts[j];

            if (contractB === undefined) {
                continue;
            }

            if (contractA.personId !== contractB.personId) {
                continue;
            }

            const startA = Date.parse(contractA.startDate);
            const endA = Date.parse(contractA.endDate);
            const startB = Date.parse(contractB.startDate);
            const endB = Date.parse(contractB.endDate);

            const overlaps = startA < endB && startB < endA;

            if (overlaps) {
                throw new Error(
                    `Person ${contractA.personId} has overlapping active contracts ${contractA.id} and ${contractB.id}`
                );
            }
        }
    }
}

function validatePlayerMetric(
    value: number,
    fieldName: string,
    personId: string
): void {
    if (!Number.isFinite(value) || value < 0 || value > 100) {
        throw new Error(
            `PlayerState ${fieldName} for ${personId} must be between 0 and 100`
        );
    }
}

function assertUniqueIds(
    entityName: string,
    entities: Array<{ id: string }>
): void {
    const ids = new Set<string>();

    for (const entity of entities) {
        assertNonEmpty(entity.id, `${entityName} id`);

        if (ids.has(entity.id)) {
            throw new Error(`${entityName} contains duplicate id ${entity.id}`);
        }

        ids.add(entity.id);
    }
}

function assertNonEmpty(value: string, fieldName: string): void {
    if (value.trim().length === 0) {
        throw new Error(`${fieldName} cannot be empty`);
    }
}
