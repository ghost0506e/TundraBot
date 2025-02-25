import { Invite } from "discord.js";
import { EventHandler } from "../base/EventHandler";
import { TundraBot } from "../base/TundraBot";
import { DBGuild } from "../models/Guild";
import Deps from "../utils/deps";
import Logger from "../utils/logger";

export default class InviteCreateHandler extends EventHandler {
    protected DBGuildManager: DBGuild;
    constructor(client: TundraBot) {
        super(client);

        this.DBGuildManager = Deps.get<DBGuild>(DBGuild);
    }

    async invoke(invite: Invite): Promise<void> {
        try {
            if (!invite.guild.available) return;

            const settings = await this.DBGuildManager.get(invite.guild);

            // Join messages are enabled and invite tracking is on
            if (
                settings.joinMessages.enabled &&
                settings.joinMessages.trackInvites
            ) {
                let currentInvites = this.client.guildInvites.get(
                    invite.guild.id
                );
                if (!currentInvites) currentInvites = new Map();
                currentInvites.set(invite.code, invite);
                this.client.guildInvites.set(invite.guild.id, currentInvites);
            }
        } catch (err) {
            Logger.log("error", `guildMemberAdd event error:\n${err}`);
        }
    }
}