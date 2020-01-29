const INITIAL_STATE = {
    locations: []
};

export default function location(state = INITIAL_STATE, action) {
    if (action.type === 'ADD_LOCATION') {
        let { locations } = state;
        
        locations.push(action.location);
        
        locations = locations.slice(-5);

        return { ...state, locations }
    }

    return state;
}