class World {
    constructor() {
        this.grid_length = 150;
        this.grid = [];
        this.temp_grid = [];
        this.population = [];
        this.max_ants_on_grid = 100;
        this.ms_between_updates = 33; // this shouldn't be here -> move to draw
        this.ants_out_of_nest = 0;
        this.colony = new Colony( 0, 0 );

    }

    init() {
        this.init_grid();
        this.place_food();
    }

    init_grid() {
        for ( let x = 0; x < this.grid_length; x = x + 1 ) {
            this.grid[ x ] = [];
            this.temp_grid[ x ] = [];
            for ( let y = 0; y < this.grid_length; y = y + 1 ) {
                world.grid[ x ][ y ] = new Cell( x, y );
                world.temp_grid[ x ][ y ] = new Cell( x, y );
            }
        }
    }

    place_food() {
        let center_x = Math.round( this.grid_length * 0.8 );
        let center_y = center_x;
        let max_distance = this.grid_length / 10;
        for ( let x = center_x - max_distance; x <= center_x + max_distance; x++ ) {
            for ( let y = center_y - max_distance; y < center_y + max_distance; y++ ) {
                let bounded_x = utils.get_bounded_index( x, 0, this.grid_length - 1 );
                let bounded_y = utils.get_bounded_index( y, 0, this.grid_length - 1 );
                let distance = utils.calc_distance( center_x, center_y, bounded_x, bounded_y )
                let food_level = Math.round( 10 - Math.pow( distance, 1.2 ) );
                this.grid[ x ][ y ].food = food_level;
            }
        }
    }

    place_colonies() {
        
    }

    // Returns a random cooridnate octilinear to a ( x, y ) coordinate ( think a king's movement range in chess ), including the original coordinate.
    get_random_coordinates ( x, y ) {
        let x2   = utils.get_random_int( x - 1, x + 1 );
        let y2  = utils.get_random_int( y - 1, y + 1);
        x2  = utils.get_bounded_index( x2, 0, this.grid_length - 1 );
        y2 = utils.get_bounded_index( y2, 0, this.grid_length - 1 );

        return [ x2, y2 ];
    }
}
