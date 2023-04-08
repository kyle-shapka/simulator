class Ant {
    constructor( x, y, world ) {
        this.x = x;
        this.y = y;
        this.world = world;
        this.has_food = false;
        this.last_signal = 0;
        this.orientation = Math.random() * 90;
    }

    // Returns the distance from location x, y to the nest.
    calc_distance_to_nest( x, y ) {
        return utils.calc_distance( x, y, 0, 0 );
    }

    get_coords_from_orientation() {
        let orientation_radians = utils.degrees_to_radians( this.orientation )
        let x = Math.round( this.x + Math.cos( orientation_radians ) );
        let y = Math.round( this.y + Math.sin( orientation_radians ) );

        let boundedX = utils.get_bounded_index( x, 0, this.world.grid_length - 1 );
        let boundedY = utils.get_bounded_index( y, 0, this.world.grid_length - 1 );
        
        let coords = [ boundedX, boundedY ];

        return coords;
    }

    move() {
        let x1 = this.x;
        let y1 = this.y;
        let new_coords, x2, y2;
         if ( this.has_food ) {
            let current_distance = this.calc_distance_to_nest( x1, y1 );
            do {
                this.orientation = Math.random() * 360;
                new_coords = this.get_coords_from_orientation();
                x2 = new_coords[0];
                y2 = new_coords[1];
            } while ( this.calc_distance_to_nest( x2, y2 ) >= current_distance );
        }
        else {
            // Move randomly if there is no signal.
            new_coords = this.get_coords_from_orientation();
            x2 = new_coords[0];
            y2 = new_coords[1];
            this.orientation += Math.random() * 45 - 22.5; // why these numbers? parameterzie

            // Scan the surroundings for a signal.
            let last = this.last_signal;
            let current;
            let min = 0;
            let max = 0;
            for ( let scanX = x1 - 1; scanX <= x1 + 1; scanX++ ) {
                for ( let scanY = y1 - 1; scanY <= y1 + 1; scanY++ ) {
                    let boundedX = utils.get_bounded_index( scanX, 0, this.world.grid_length - 1 );
                    let boundedY = utils.get_bounded_index( scanY, 0, this.world.grid_length - 1 );
                    current = this.world.grid[ boundedX ][ boundedY ].signal;
                    if ( 0 === current.signal ) {
                        continue;
                    }
                    let diff = last - current;
                    if ( 0 == last ) {
                        if ( diff < min ) {
                            x2 = boundedX;
                            y2 = boundedY;
                        }
                    }
                    else {
                        if ( diff > max ) {
                            x2 = boundedX;
                            y2 = boundedY;
                        }
                    }
                }
            }
            // There's always a small chance of moving randomly instead.
            // Try moving this to the top so that we can save computation
            // I also don't like that they *always* might move randomly. That doesn't make sense when returning home.
            /* if ( Math.random() < 0.05 ) {
                new_coords = this.world.get_random_coordinates( x1, y1 );
                x2 = new_coords[0];
                y2 = new_coords[1];
            } */
        }

        // Now that we've chosen new coordinates, it's time to move.
        if( ! this.world.temp_grid[ x2 ][ y2 ].has_ant() ) {
            this.x = x2;
            this.y = y2;
            world.temp_grid[ x2 ][ y2 ].ant = world.temp_grid[ x1 ][ y1 ].ant;
            world.temp_grid[ x1 ][ y1 ].ant = null;
        }
    }
}
