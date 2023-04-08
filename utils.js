let colours = {
    background: '#333'
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
}
