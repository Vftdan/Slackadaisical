
const blessed = require('blessed');
const SlackAPI = require('./SlackAPI');
const ChannelsList = require('./ChannelsList');
const ChannelBox = require('./Channel');
const ExLine = require('./ExLine');
const moment = require('moment');

export default class Slacker {

    constructor(token) {
        this.token = token;

        this.screen = blessed.screen({
            smartCSR: true,
            log: process.env.PWD + '/slacker.log',
            debug: true,
            dockBorders: true,
            autoPadding: true,
            ignoreDockContrast: true,
            fullUnicode: true,
        });

        this.api = new SlackAPI(this.token, this.screen);
        this.channelsList = new ChannelsList(this.screen, this.api);
        this.exLine = new ExLine(this.screen);
        this.channel = null;
        this.channelBox = null;

        this.screen.log(moment().format() + ": Slacker Init");
    }

    changeChannel(channel) {
        this.channel = channel;

        if (this.channelBox) {
            this.channelBox.destroy();
            this.channelBox = null;
        }

        this.channelBox = new ChannelBox(this.channel, this.screen, this.api);

    }

    init() {

        this.exLine.commands.q = function() {
            return process.exit(0);
        }

        this.exLine.commands.stop =
        this.exLine.commands.suspend = () => {
            return this.suspend();
        }

        this.screen.key(['C-c'], function(ch, key) {
            return process.exit(0);
        });

        this.screen.key(['C-z'], (ch, key) => {
            return this.suspend();
        });

        this.screen.key([':'], (ch, key) => {
            this.exLine.textbox.focus();
        });

        this.screen.key(['C-l', 'escape'], (ch, key) => {
            if (this.channelsList) {
                this.channelsList.box.focus();
            }
        });

        this.screen.key(['C-o', 'i'], (ch, key) => {
            if (this.channelBox && this.channelBox.messageForm && this.channelBox.messageForm.textbox) {
                this.channelBox.messageForm.textbox.focus();
            }
        });

        this.screen.key(['C-y'], (ch, key) => {
            if (this.channelBox && this.channelBox.messagesList && this.channelBox.messagesList.box) {
                this.channelBox.messagesList.box.focus();
            }
        });

        this.channelsList.on('select_channel', (ch) => {
            this.changeChannel(ch);
        });

        this.channelsList.init();
    }

    suspend() {
        //TODO
        this.screen.leave();
        //this.screen.sigtstp();
        process.kill(process.pid, 'SIGSTOP');
        this.screen.alloc();
        this.screen.render();
        this.screen.program.lrestoreCursor('pause', true);
    }

}

module.exports = Slacker;
