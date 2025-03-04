let colours = {
    background: 'rgba( 51, 51, 51, 255 )',//'#333333',
    ant:  'rgba( 0, 0, 0, 255 )',
    food: 'rgba( 86, 169, 46, 255 )', //#56a92e
    antFood: 'rgba( 159, 248, 101, 255 )', //#9FF865,
    signal: 'rgba( 17, 103, 255 )'//'#116700'
}

let utils = {

    // Replaces indices that would be outside of range with min or max, respectively.
    get_bounded_index ( index, min, max ) {
        let bounded_index = index;
        if ( index < min ) {
            bounded_index = min;
        }
        if ( index >= max ) {
            bounded_index = max;
        }
        return bounded_index;
    },

    // Returns the distance 'c' between two cooridinates ( x1, y1 ) and ( x2, y2 ) using the formula a2 + b2 = c2.
    calc_distance: ( x1, y1, x2, y2 ) => {
        let a = Math.abs( x1 - x2 );
        let b = Math.abs( y1 - y2 );
        let c2 = Math.pow( a, 2 ) + Math.pow( b, 2 );
        return Math.pow( c2, 0.5 );
    },

    // Returns an integer between the given min and max, inclusive to both.
    get_random_int: ( min, max ) => {
        return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
    },

    // Translates degrees to radians.
    degrees_to_radians: ( degrees ) => {
        return degrees * Math.PI / 180;
    },

    // Adds opacity to a given colour.
    set_opacity: ( colour, opacity ) => {
        let rgba = colour.replace(/[^\d,]/g, '').split(',');
        let alpha = Math.round( Math.min( Math.max( opacity || 1, 0 ), 1 ) * 255 );
        
        return `rgba( ${ rgba[0] }, ${ rgba[1] }, ${ rgba[2] }, ${ alpha / 255 } )`;
    },
}
