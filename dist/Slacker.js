'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var blessed = require('blessed');
var SlackAPI = require('./SlackAPI');
var ChannelsList = require('./ChannelsList');
var ChannelBox = require('./Channel');
var ExLine = require('./ExLine');
var moment = require('moment');

var Slacker = function () {
    function Slacker(token) {
        _classCallCheck(this, Slacker);

        this.token = token;

        this.screen = blessed.screen({
            smartCSR: true,
            log: process.env.PWD + '/slacker.log',
            debug: true,
            dockBorders: true,
            autoPadding: true,
            ignoreDockContrast: true,
            fullUnicode: true
        });

        this.api = new SlackAPI(this.token, this.screen);
        this.channelsList = new ChannelsList(this.screen, this.api);
        this.exLine = new ExLine(this.screen);
        this.channel = null;
        this.channelBox = null;

        this.screen.log(moment().format() + ": Slacker Init");
    }

    _createClass(Slacker, [{
        key: 'changeChannel',
        value: function changeChannel(channel) {
            this.channel = channel;

            if (this.channelBox) {
                this.channelBox.destroy();
                this.channelBox = null;
            }

            this.channelBox = new ChannelBox(this.channel, this.screen, this.api);
        }
    }, {
        key: 'init',
        value: function init() {
            var _this = this;

            this.exLine.commands.q = function () {
                return process.exit(0);
            };

            this.exLine.commands.stop = this.exLine.commands.suspend = function () {
                return _this.suspend();
            };

            this.screen.key(['C-c'], function (ch, key) {
                return process.exit(0);
            });

            this.screen.key(['C-z'], function (ch, key) {
                return _this.suspend();
            });

            this.screen.key([':'], function (ch, key) {
                _this.exLine.textbox.focus();
            });

            this.screen.key(['C-l', 'escape'], function (ch, key) {
                if (_this.channelsList) {
                    _this.channelsList.box.focus();
                }
            });

            this.screen.key(['C-o', 'i'], function (ch, key) {
                if (_this.channelBox && _this.channelBox.messageForm && _this.channelBox.messageForm.textbox) {
                    _this.channelBox.messageForm.textbox.focus();
                }
            });

            this.screen.key(['C-y'], function (ch, key) {
                if (_this.channelBox && _this.channelBox.messagesList && _this.channelBox.messagesList.box) {
                    _this.channelBox.messagesList.box.focus();
                }
            });

            this.channelsList.on('select_channel', function (ch) {
                _this.changeChannel(ch);
            });

            this.channelsList.init();
        }
    }, {
        key: 'suspend',
        value: function suspend() {
            this.screen.leave();
            //this.screen.sigtstp();
            process.kill(process.pid, 'SIGSTOP');
            this.screen.alloc();
            this.screen.render();
            this.screen.program.lrestoreCursor('pause', true);
        }
    }]);

    return Slacker;
}();

exports.default = Slacker;


module.exports = Slacker;