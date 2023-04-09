class Renderer {
    constructor( width, height ) {
        this.width = width;
        this.height = height;
        this.canvas = document.getElementById("grid");
        this.context;
        this.grid;
    }

    init() {
        if ( ! this.canvas ) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = "grid";
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            document.getElementsByTagName('body')[0].appendChild( this.canvas);
            this.context = this.canvas.getContext( '2d' );
        }
    }

    draw( grid ) {  
        
        this.draw_cells( grid );

        if ( ! this.grid ) {
            this.grid = [];
        }
        for ( let x = 0; x < grid.length; x++ ) {
            this.grid[ x ] = [];
            for ( let y = 0; y < grid.length; y++ ){
                this.grid[ x ][ y ] = this.color_for_cell( grid[ x ][ y ] );
            }
        }
    }

    draw_cells( grid ){
        let width_cell = this.width / grid.length;
        let height_cell = this.height / grid.length;
        console.log (grid.length)
            
        for ( let x = 0; x < grid.length; x++ ) {
            for ( let y = 0; y < grid.length; y++ ) {
                if ( this.grid && this.grid[ x ][ y ] === this.color_for_cell( grid[ x ][ y ] ) ) {
                    continue;
                } 
                this.context.clearRect( x * width_cell, y * height_cell, width_cell, height_cell );
                this.context.fillStyle = this.color_for_cell( grid[ x ][ y ] );
                this.context.fillRect( x * width_cell, y * height_cell, width_cell, height_cell );
            }
        }
        
    }

    color_for_cell = ( cell ) => {
        if ( cell.has_ant() ) {
            return cell.ant.has_food ? "rgb(159,248,101)" : "rgb(0,0,0)";
        }
        else if ( cell.food > 0 ) {
            return "rgba(86,169,46," + Math.pow( cell.food / 10, 0.5 ) + ")";
        }
        else {
            if ( cell.signal > 0 ) {
                return "rgba(17,103,189," + cell.signal + ")";
            }
            else return colours.background;
        }
    }
}