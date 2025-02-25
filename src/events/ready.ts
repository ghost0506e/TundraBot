import CheckPolls from "../helpers/checkPolls";
import CheckEvents from "../helpers/checkEvents";
import { EventHandler } from "../base/EventHandler";
import Logger from "../utils/logger";
import { TundraBot } from "../base/TundraBot";
import PlayerInit from "../helpers/playerInit";
import CacheInvites from "../helpers/cacheInvites";
import LoadMemberSoundEffects from "../helpers/loadMemberSoundEffects";
import GuildsSanityCheck from "../helpers/guildsSanityCheck";
import CacheMembers from "../helpers/cacheMembers";
import CheckReminders from "../helpers/checkReminders";
import CheckMutes from "../helpers/checkMutes";
import CheckBans from "../helpers/checkBans";
import LoadRoleMenus from "../helpers/loadRoleMenus";
import { PresenceData } from "discord.js";

export default class ReadyHandler extends EventHandler {
    botStatusState: number; // index of current status
    static botStatuses: PresenceData[] = [
        {
            status: "online",
            activity: {
                name: "~help (not -)!",
                type: "WATCHING",
            },
        },
        {
            status: "online",
            activity: {
                name: "tundrabot.xyz",
                type: "WATCHING",
            },
        },
        {
            status: "online",
            activity: {
                name: "audio filters | ~filter",
                type: "LISTENING",
            },
        },
    ];
    Player: PlayerInit;
    GuildsSanityCheck: GuildsSanityCheck;
    CacheMembers: CacheMembers;
    CheckPolls: CheckPolls;
    CheckEvents: CheckEvents;
    LoadRoleMenus: LoadRoleMenus;
    LoadMemberSoundEffects: LoadMemberSoundEffects;
    CheckBans: CheckBans;
    CheckMutes: CheckMutes;
    CheckReminders: CheckReminders;
    CacheInvites: CacheInvites;
    constructor(client: TundraBot) {
        super(client);
        this.botStatusState = 0;
        this.Player = new PlayerInit(this.client);
        this.GuildsSanityCheck = new GuildsSanityCheck(this.client);
        this.CacheMembers = new CacheMembers(this.client);
        this.CheckPolls = new CheckPolls(this.client);
        this.CheckEvents = new CheckEvents(this.client);
        this.LoadRoleMenus = new LoadRoleMenus(this.client);
        this.LoadMemberSoundEffects = new LoadMemberSoundEffects(this.client);
        this.CheckBans = new CheckBans(this.client);
        this.CheckMutes = new CheckMutes(this.client);
        this.CheckReminders = new CheckReminders(this.client);
        this.CacheInvites = new CacheInvites(this.client);
    }

    async invoke(): Promise<void> {
        this.cycleStatus();
        setInterval(this.cycleStatus.bind(this), 10 * 1000); // cycle status every 10 seconds

        this.Player.init();
        await this.GuildsSanityCheck.init();
        this.CacheMembers.init();
        this.CheckPolls.init();
        this.CheckEvents.init();
        this.LoadRoleMenus.init();
        this.LoadMemberSoundEffects.init();
        this.CheckBans.init();
        this.CheckMutes.init();
        this.CheckReminders.init();
        this.CacheInvites.init();

        Logger.log(
            "ready",
            `I'm now online, my name is ${this.client.user.tag}`
        );
    }

    async cycleStatus(): Promise<void> {
        this.client.user
            .setPresence(ReadyHandler.botStatuses[this.botStatusState])
            .catch((err) => {
                Logger.log("error", `Error setting bot status: ${err}`);
            });

        this.botStatusState = (this.botStatusState + 1) % ReadyHandler.botStatuses.length;
    }
}
