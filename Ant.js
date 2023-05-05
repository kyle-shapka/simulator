class Ant {
    constructor( x, y, world, context ) {
        this.x = x;
        this.y = y;
        this.world = world;
        this.has_food = false;
        this.last_signal = 0;
        this.orientation = Math.random() * 90;
        this.context = context;
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
        let oldX = this.x;
        let oldY = this.y;
        let new_coords, newX, newY;
         if ( this.has_food ) {
            let current_distance = this.calc_distance_to_nest( oldX, oldY );
            do {
                this.orientation = Math.random() * 360;
                new_coords = this.get_coords_from_orientation();
                newX = new_coords[0];
                newY = new_coords[1];
            } while ( this.calc_distance_to_nest( newX, newY ) >= current_distance );
        }
        else {
            // Move randomly if there is no signal.
            new_coords = this.get_coords_from_orientation();
            newX = new_coords[0];
            newY = new_coords[1];
            this.orientation += Math.random() * 45 - 22.5; // why these numbers? parameterize

            // Scan the surroundings for a signal.
            let last = this.last_signal;
            let current;
            let min = 0;
            let max = 0;
            for ( let scanX = oldX - 1; scanX <= oldX + 1; scanX++ ) {
                for ( let scanY = oldY - 1; scanY <= oldY + 1; scanY++ ) {
                    let boundedX = utils.get_bounded_index( scanX, 0, this.world.grid_length - 1 );
                    let boundedY = utils.get_bounded_index( scanY, 0, this.world.grid_length - 1 );
                    
                    let focus = utils.get_colour( this.context, boundedX, boundedY ) ;
                    //console.log(focus);
                    //console.log(colours.signal)

                    if ( colours.signal == focus ) {
                        console.log( "found a signal" );
                    }
                    else if ( colours.ant == focus ) {
                        console.log( "found another ant" );
                    }

                    //current = this.world.grid[ boundedX ][ boundedY ].signal;
                    

                    // if ( 0 === current ) {
                    //     continue;
                    // }
                    
                    // let diff = last - current;
                    //     if ( 0 == last ) {
                    //         if ( diff < min ) {
                    //             newX = boundedX;
                    //             newY = boundedY;
                    //             //min = diff;
                    //         }
                    //     }
                    //     else {
                    //         if ( diff > max ) {
                    //             console.log(utils.get_opacity ( utils.get_colour( this.context, oldX, oldY ) ));
                    //             newX = boundedX;
                    //             newY = boundedY;
                    //             //max = diff;
                    //         }
                    //     }
                }
            }
            // There's always a small chance of moving randomly instead.
            // Try moving this to the top so that we can save computation
            // I also don't like that they *always* might move randomly. That doesn't make sense when returning home.
            if ( Math.random() < 0.05 ) {
                new_coords = this.world.get_random_coordinates( oldX, oldY );
                newX = new_coords[0];
                newY = new_coords[1];
            }
        }

        // Now that we've chosen new coordinates, it's time to move.
        if( ! this.world.temp_grid[ newX ][ newY ].has_ant() ) {
            this.x = newX;
            this.y = newY;
            world.temp_grid[ newX ][ newY ].ant = world.temp_grid[ oldX ][ oldY ].ant;
            world.temp_grid[ oldX ][ oldY ].ant = null;
        }
    }
}
