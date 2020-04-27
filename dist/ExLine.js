'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var blessed = require('blessed');

var ExLine = function () {
    function ExLine(screen) {
        var _this = this;

        _classCallCheck(this, ExLine);

        this.screen = screen;

        this.commands = {};

        this.form = blessed.form({
            parent: this.screen,
            keys: true,
            left: 0,
            bottom: 0,
            width: '100%',
            height: 4
        });

        this.textbox = blessed.textbox({
            parent: this.form,
            left: 0,
            top: 0,
            width: '100%',
            height: 4,
            input: true,
            mouse: true,
            keys: true,
            inputOnFocus: true,
            label: 'Ex (:)',
            border: { type: 'line', fg: 'yellow' }
        });

        this.textbox.key('enter', function (ch, key) {
            _this.form.submit();
        });

        this.form.on('submit', function (data) {
            var command = data.textbox;
            _this.execute(command);
            _this.form.reset();
        });
    }

    _createClass(ExLine, [{
        key: 'execute',
        value: function execute(command) {
            if (command.length > 0) {
                var argv = command.trim().split(/\s+/g);
                if (argv.length < 1) return;
                if (this.commands.propertyIsEnumerable(argv[0])) return this.commands[argv[0]].apply(null, argv.slice(1));
            }
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.form.destroy();
            this.textbox.destroy();
        }
    }]);

    return ExLine;
}();

exports.default = ExLine;


module.exports = ExLine;