class Cell {
    constructor( x, y ) {
        this.x = x;
        this.y = y;
        this.ant = null;
        this.food = 0;
        this.signal = 0;
    }

    has_ant = ( () => {
        return this.ant ? true : false;
    } );
}