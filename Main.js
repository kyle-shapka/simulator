let _data; // data from previous update
let world = new World( _data );

function draw_grid( data ) {
    const width = 600;
    const height = 600;

    world.grid_length = data.length;

    let width_cell = width / world.grid_length;
    let height_cell = height / world.grid_length;

    let canvas = document.getElementById( 'grid' )
    if ( null === canvas ) {
        canvas = document.createElement( 'canvas' );
        canvas.id = 'grid';
        canvas.width = width;
        canvas.height = height;
        document.getElementsByTagName('body')[0].appendChild(canvas);
    }

    let context = canvas.getContext("2d");
    
    function draw_cells(){
        
        for ( let i = 0; i < world.grid_length; i++ ) {
            for ( let j = 0; j < world.grid_length; j++ ) {
                if ( _data && _data[ i ][ j ] === color_for_cell( data[ i ][ j ] ) ) {
                    continue;
                } 
                context.clearRect( i * width_cell, j * height_cell, width_cell, height_cell );
                context.fillStyle = color_for_cell( data[ i ][ j ] );
                context.fillRect( i * width_cell, j * height_cell, width_cell, height_cell );
            }
        }
        
    }
    draw_cells();
    if ( ! _data ) {
        _data = [];
    }
    for ( let i = 0; i < world.grid_length; i++ ) {
        _data[ i ] = [];
        for ( let j = 0; j < world.grid_length; j++ ){
            _data[ i ][ j ] = color_for_cell( data[ i ][ j ] );
        }
    }
}

function update_grid( data ) {
    draw_grid( data );
}

const color_for_cell = ( cell ) => {
    if ( cell.has_ant() ) {
        return cell.ant.has_food ? "rgb(159,248,101)" : "rgb(0,0,0)";
    }
    else if ( cell.food > 0 ) {
        return "rgba(86,169,46," + Math.pow( cell.food / 10,0.5 ) + ")";
    }
    else {
        if ( cell.signal > 0 ) {
            let signal = cell.signal > 1 ? 1 : cell.signal;
            return "rgba(17,103,189," + cell.signal + ")";
        }
        else return "rgb(250,250,250)";
    }
}

const opacity_for_signal = ( cell ) => {
    return cell.has_ant() ? "1.0": cell.signal;
}

function initialize_simulation() {
    world.init();
    draw_grid( world.grid.map( ( row ) => {
        return row.map( (cell) => {
            return cell;
        });
    }));
}

initialize_simulation();
let interval_id = setInterval( simulate_and_visualize, world.ms_between_updates );


function simulate_and_visualize() {
    run_time_step();
    update_grid( world.grid.map( ( row )=> {
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
