let world = new World();
let renderer = new Renderer( 600, 600 );

initialize_simulation();
let interval_id = setInterval( simulate_and_visualize, world.ms_between_updates );

function initialize_simulation() {
    world.init();
    renderer.init();
    renderer.draw( world.grid.map( ( row ) => {
        return row.map( (cell) => {
            return cell;
        });
    }));
}

const opacity_for_signal = ( cell ) => {
    return cell.has_ant() ? "1.0": cell.signal;
}



function simulate_and_visualize() {
    run_time_step();
    renderer.draw( world.grid.map( ( row )=> {
        return row.map( ( cell )=> {
            return cell;
        });
    }));
}

function run_time_step() {
    move_ants();
    check_for_food();
    sense_signal();	
}

function sense_signal() {
    for ( let i = 0; i < world.grid_length; i = i + 1 ) {
        for ( let j = 0; j < world.grid_length; j = j + 1) {
            if ( world.grid[ i ][ j ].has_ant()) {
                world.grid[ i ][ j ].ant.last_signal = world.grid[ i ][ j ].signal;
            }
        }
    }
}

function move_ants() {
    for ( let i = 0; i < world.grid_length; i = i + 1 ) {
        for ( let j = 0; j < world.grid_length; j = j + 1 ) {
            if ( world.grid[ i ][ j ].has_ant() ) {
                let ant = world.grid[ i ][ j ].ant;
                ant.move();
            }
        }
    }
    // signal
    for ( let i = 0; i < world.grid_length; i = i + 1 ) {
        for ( let j = 0; j < world.grid_length; j = j + 1 ) {
            // adjust reference
            world.grid[ i ][ j ].ant = world.temp_grid[ i ][ j ].ant; 
            if ( world.grid[ i ][ j ].has_ant() && world.grid[ i ][ j ].ant.has_food) {
                bounded_i = utils.get_bounded_index( i, 0, world.grid_length - 1 );
                bounded_j = utils.get_bounded_index( j, 0, world.grid_length - 1 );
                let signal_strength = 1 - Math.pow( 0.5, 1 / utils.calc_distance( i, j, bounded_i, bounded_j ) );
                world.grid[ bounded_i ][ bounded_j ].signal += signal_strength;
                // is the ant near the nest with food? drop food
                if ( i < 5 && j < 5 ) {
                    world.grid[ i ][ j ].ant.has_food = false;
                }
            }
            else {
                world.grid[ i ][ j ].signal *= 0.95;	
            }
            if ( world.grid[ i ][ j ].signal < 0.05 ) {
                world.grid[ i ][ j ].signal = 0;	
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
    if ( ! world.grid[ x2 ][ y2 ].has_ant() && world.ants_out_of_nest < world.max_ants_on_grid) {
        world.grid[ x2 ][ y2 ].ant = new Ant( x2, y2, world );
        world.temp_grid[ x2 ][ y2 ].ant = world.grid[ x2 ][ y2 ].ant;
        world.ants_out_of_nest++;
    }
}

// Move to an individual ant level
function check_for_food() {
    for ( let i = 0; i < world.grid_length; i = i + 1 ) {
        for ( let j = 0; j < world.grid_length; j = j + 1) {
            if ( world.grid[ i ][ j ].has_ant() && ! world.grid[ i ][ j ].ant.has_food) {
                if ( world.grid[ i ][ j ].food > 0) {
                    world.grid[ i ][ j ].ant.has_food = true;
                    world.grid[ i ][ j ].food--;	
                }
            }
        }
    }
}
