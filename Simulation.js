let world = new World();
let renderer = new Renderer( 600, 600 );

setup();
//let interval_id = setInterval( simulate_and_visualize, world.ms_between_updates );

function setup() {
    world.init();
    renderer.init();
    draw();
    begin();
}

function draw() {
    renderer.draw( world.grid.map( ( row ) => {
        return row.map( (cell) => {
            return cell;
        });
    }));
}

function begin() { // cap this at a certain fps or simulation speed adjustable
    const step = () => {
        move_ants();
        check_for_food();
        sense_signal();
        draw();

        requestAnimationFrame( () => {
            step();
        } );
    }
    step();
}

function move_ants() {
    for ( let x = 0; x < world.grid_length; x = x + 1 ) {
        for ( let y = 0; y < world.grid_length; y = y + 1 ) {
            if ( world.grid[ x ][ y ].has_ant() ) {
                let ant = world.grid[ x ][ y ].ant;
                ant.move();
            }
        }
    }
    // signal
    for ( let x = 0; x < world.grid_length; x = x + 1 ) {
        for ( let y = 0; y < world.grid_length; y = y + 1 ) {
            // adjust reference
            world.grid[ x ][ y ].ant = world.temp_grid[ x ][ y ].ant; 
            if ( world.grid[ x ][ y ].has_ant() && world.grid[ x ][ y ].ant.has_food) {
                bounded_x = utils.get_bounded_index( x, 0, world.grid_length - 1 );
                bounded_y = utils.get_bounded_index( y, 0, world.grid_length - 1 );
                let signal_strength = 1 - Math.pow( 0.5, 1 / utils.calc_distance( x, y, bounded_x, bounded_y ) );
                world.grid[ bounded_x ][ bounded_y ].signal += signal_strength;
                // is the ant near the nest with food? drop food
                if ( x < 5 && y < 5 ) {
                    world.grid[ x ][ y ].ant.has_food = false;
                }
            }
            else {
                world.grid[ x ][ y ].signal *= 0.95;	
            }
            if ( world.grid[ x ][ y ].signal < 0.05 ) {
                world.grid[ x ][ y ].signal = 0;	
            }
        }
    }
    spawn_ant();	
}

function spawn_ant() {
    let x1 = 0;
    let y1 = 0;
    let new_coords = world.get_random_coordinates( x1, y1 );
    let x2 = new_coords[0];
    let y2 = new_coords[1];
    if ( ! world.grid[ x2 ][ y2 ].has_ant() && world.ants_out_of_nest < world.max_ants_on_grid ) {
        world.grid[ x2 ][ y2 ].ant = new Ant( x2, y2, world );
        world.temp_grid[ x2 ][ y2 ].ant = world.grid[ x2 ][ y2 ].ant;
        world.ants_out_of_nest++;
    }
}

// Move to an individual ant level
function check_for_food() {
    for ( let x = 0; x < world.grid_length; x = x + 1 ) {
        for ( let y = 0; y < world.grid_length; y = y + 1) {
            if ( world.grid[ x ][ y ].has_ant() && ! world.grid[ x ][ y ].ant.has_food ) {
                if ( world.grid[ x ][ y ].food > 0 ) {
                    world.grid[ x ][ y ].ant.has_food = true;
                    world.grid[ x ][ y ].food--;	
                }
            }
        }
    }
}

function sense_signal() {
    for ( let x = 0; x < world.grid_length; x = x + 1 ) {
        for ( let y = 0; y < world.grid_length; y = y + 1) {
            if ( world.grid[ x ][ y ].has_ant()) {
                world.grid[ x ][ y ].ant.last_signal = world.grid[ x ][ y ].signal;
            }
        }
    }
}
