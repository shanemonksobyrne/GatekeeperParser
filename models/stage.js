const STEPS = {
    PLANTING: "PLANTING",
    PESTICIDES: "PESTICIDES",
    FERTILIZING: "FERTILIZING",
    IRRIGATION: "IRRIGATION",
    HARVESTING: "HARVESTING"
};

class Stage {
    /* @param {String} field
     * @param {STEP} step
     * @param {String} description
     * @param {Date} date
     */
    constructor(field, step, description, date) {
        this.field = field;
        this.step = step;
        this.description = description;
        this.date = date;
    }
}

module.exports.Stage = Stage;
module.exports.STEPS = STEPS;