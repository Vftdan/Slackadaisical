var blessed = require('blessed');

export default class ExLine {

    constructor(screen) {
        this.screen = screen;

        this.commands = {};

        this.form = blessed.form({
            parent: this.screen,
            keys: true,
            left: 0,
            bottom: 0,
            width: '100%',
            height: 4,
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
            border: {type: 'line', fg: 'yellow' }
        });

        this.textbox.key('enter', (ch, key) => {
            this.form.submit();
        });

        this.form.on('submit', (data) => {
            const command = data.textbox;
            this.execute(command);
            this.form.reset();
        });
    }

    execute(command) {
        if (command.length > 0) {
            const argv = command.trim().split(/\s+/g);
            if (argv.length < 1)
                return;
            if (this.commands.propertyIsEnumerable(argv[0]))
                return this.commands[argv[0]].apply(null, argv.slice(1));
        }
    }

    destroy() {
        this.form.destroy();
        this.textbox.destroy();
    }
}

module.exports = ExLine;
