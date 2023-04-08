class Colony {
    constructor( x, y, world ) {
        this.x = x;
        this.y = y;
        this.world = world;
        this.ants = [];
    }

    spawn_ant() {
        let new_coords = utils.get_random_coordinates( this.x, this.y );
        let x2 = new_coords[0];
        let y2 = new_coords[1];
        if ( ! grid[ x2 ][ y2 ].has_ant() && ants_out_of_nest < max_ants_on_grid) {
            grid[ x2 ][ y2 ].ant = new Ant( x2, y2 );
            temp_grid[ x2 ][ y2 ].ant = grid[ x2 ][ y2 ].ant;
            ants_out_of_nest++;
        }
    }

    move_ants() {
        for ( let x = 0; x < grid_length; x = x + 1 ) {
            for ( let y = 0; y < grid_length; y = y + 1 ) {
                if ( grid[ x ][ y ].has_ant() ) {
                    move_ant( x, y );
                }
            }
        }
        // signal
        for ( x = 0; x < grid_length; x = x + 1 ) {
            for ( let y = 0; y < grid_length; y = y + 1 ) {
                // adjust reference
                grid[ x ][ y ].ant = temp_grid[ x ][ y ].ant; 
                if ( grid[ x ][ y ].has_ant() && grid[ x ][ y ].ant.has_food) {
                    bounded_x = utils.get_bounded_index( x );
                    bounded_y = utils.get_bounded_index( y );
                    let signal_strength = 1 - Math.pow( 0.5, 1 / utils.calc_distance( x, y, bounded_x, bounded_y ) );
                    grid[ bounded_x ][ bounded_y ].signal += signal_strength;
                    // is the ant near the nest with food? drop food
                    if ( x < this.x && y < this.y ) {
                        grid[ x ][ y ].ant.has_food = false;
                    }
                }
                else {
                    grid[ x ][ y ].signal *= 0.95;	
                }
                if ( grid[ x ][ y ].signal < 0.05 ) {
                    grid[ x ][ y ].signal = 0;	
                }
            }
        }
        this.spawn_ant();	
    }
}