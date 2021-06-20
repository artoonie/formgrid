/*
 * AxisConfig controls how to label each axis, and whether the axis labels are user-configurable
 */
class AxisConfig {
    constructor() {
        /*
         * Should the label be a user-editable textbox?
         */
        this.userEditable = false;

        /*
         * A string to label each item along this axis.
         * May include "%d" to demarcate the row or column number.
         */
        this.labelPrefix = "Item";
    }

    /*
     * This function uses labelPrefix to create a label.
     * You may override it to include custom behavior, such as 0-indexing.
     */ 
    makeLabel(forIndex) {
        return this.labelPrefix + " " + forIndex;
    }
}

class InitialFormGridConfig {
    constructor() {
        /*
         * Row axis configuration. See @AxisConfig
         */
        this.rowAxisConfig = new AxisConfig();

        /*
         * Col axis configuration. See @AxisConfig
         */
        this.colAxisConfig = new AxisConfig();

        /*
         * Initial data: a 1x1 grid with a 0 in the single cell
         */
        this.data = [[0,1], [2, 3]]
    }
}

class FormGridModel {
    constructor(initialData) {
        // The data in each cell
        this.data = initialData;

        // Labels along the row, if it's user editable
        this.rowLabels = [];

        // Labels along the column, if it's user editable
        this.colLabels = [];
    }

    rows() {
        return this.data.length + 1; // +1 for the header
    }

    cols() {
        return this.data.length > 0 ? this.data[0].length + 1 : 1; // +1 for the header
    }
}

class FormGrid {
    /**
     * @param parentDivId Div in which to place the created table
     */
    constructor(parentDivId, initialConfig) {
        this.elemTable = document.createElement('table');
        this.elemHeader = this.elemTable.insertRow(0);
        this.elemRows = [];

        this.rowAxisConfig = initialConfig.rowAxisConfig;
        this.colAxisConfig = initialConfig.colAxisConfig;

        // The data model
        this.model = new FormGridModel(initialConfig.data);

        this.deserializeModel();

        const parent = document.getElementById(parentDivId);
        parent.appendChild(this.elemTable);
    }

    deserializeModel() {
        this.updateTableSizeToMatchModel();

        const dataNumRows = this.model.rows();
        const dataNumCols = this.model.cols();
        for (let r = 0; r < dataNumRows; ++r) {
            for (let c = 0; c < dataNumCols; ++c) {
                this.populateCell(r, c);
            }
        }
    }

    serializeModel() {
        const rows = this.rowsInView();
        const cols = this.colsInView();

        for (let r = 0; r < rows; ++r) {
            for (let c = 0; c < cols; ++c) {
                this.data.setData(r, c, this.elemRows[r].cells[c].getChild("input").innerHTML);
            }
        }
    }

    createCellChildElem(isUserEditable) {
        let elem;
        if (isUserEditable) {
            elem = document.createElement("input");
            elem.type = "text";
        } else {
            elem = document.createElement("p");
        }
        return elem;
    }

    /**
     * Is the given cell user-editable?
     */
    isUserEditable(r, c) {
        if (r > 0 && c > 0) {
            return true;
        }

        if (r == 0) {
            return this.rowAxisConfig.userEditable;
        } else {
            return this.colAxisConfig.userEditable;
        }
    }

    getTextForCell(r, c) {
        let text;
        if (r == 0 && c == 0) {
            text = "";
        } else if (r != 0 && c != 0) {
            text = this.model.data[r-1][c-1];
        } else if (r == 0) {
            text = this.rowAxisConfig.makeLabel(c);
        } else if (c == 0) {
            text = this.colAxisConfig.makeLabel(r);
        }
        return text;
    }

    setData(r, c, data) {
        if (r == 0 && c == 0) {
            throw new Exception("Can't set data on (0, 0). Did you leave room for headers?");
        }

        if (r != 0 && c != 0) {
            this.model.data[r-1][c-1] = data;
        }

        if (r == 0) {
            if (this.rowLabels.length < c+1) {
                this.rowLabels.length = c+1;
            }
            this.rowLabels[c] = data;
        }
        if (c == 0) {
            if (this.colLabels.length < r+1) {
                this.colLabels.length = r+1;
            }
            this.colLabels[r] = data;
        }
    }

    rowsInView() {
        return this.elemRows.length;
    }

    colsInView() {
        return this.elemRows.length == 0 ? 0 : this.elemRows[0].cells.length;
    }

    updateTableSizeToMatchModel() {
        const viewNumRows = this.rowsInView();
        const viewNumCols = this.colsInView();
        const dataNumRows = this.model.rows();
        const dataNumCols = this.model.cols();

        const rowDifference = dataNumRows - viewNumRows;
        const colDifference = dataNumCols - viewNumCols;

        if (rowDifference > 0) {
            for (let i = 0; i < rowDifference; ++i) {
                this.addRow();
            }
        }

        if (colDifference > 0) {
            for (let i = 0; i < colDifference; ++i) {
                this.addCol();
            }
        }

        if (rowDifference < 0) {
            for (let i = 0; i < -rowDifference; ++i) {
                this.removeRow();
            }
        }

        if (colDifference < 0) {
            for (let i = 0; i < -colDifference; ++i) {
                this.removeCol();
            }
        }
    }

    addRow() {
        const newRow = this.elemTable.insertRow();
        this.elemRows.push(newRow);
    }
    addCol() {
        const c = this.elemRows[0].length;
        for (let r = 0; r < this.elemRows.length; ++r) {
            this.elemRows[r].insertCell(c);
        }
    }

    removeRow() {
    }

    removeCol() {
    }

    /**
     * Gets the <input> or <p> in which we will fill data,
     * and fills it using getTextForCell
     */
    populateCell(r, c) {
        if (r == 0 && c == 0) {
            return;
        }

        const td = this.elemRows[r].cells[c];
        const isUserEditable = this.isUserEditable(r, c);

        let cellElem;
        if (td.children.length != 0) {
            cellElem = td.children[0];
        } else {
            cellElem = this.createCellChildElem(isUserEditable);

            this.elemRows[r].cells[c].appendChild(cellElem);
        }

        // Populate the cell
        const text = this.getTextForCell(r, c);
        if (isUserEditable) {
            cellElem.value = text;
        } else {
            cellElem.innerHTML = text;
        }
    }
}

// In case of node.js
/* eslint no-undef: ["off"] */
if (typeof exports !== typeof undefined) {
    exports.FormGrid = FormGrid
    exports.InitialFormGridConfig = InitialFormGridConfig
}
