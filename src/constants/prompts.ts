
{/* New Prompt  */}
export const itinenaryPrompt = (dateRange: number, location: string, tripType: "Busy" | "Relaxed", tripDetails: "Cultural" | "Balanced" | "Adventure" | "Sightsee") => {
    return `

    Can you make a ${dateRange} day itinerary for ${location} with the following instructions:

    1. Time to go from one place to the next is the least
    3. Also add "Must-see!" only if a particular place is a must-see attraction.
    4. Tell the town/city/area to stay at the end of each day in this format: City/Area to stay at: <Name of city/area>
    5. Make sure the city/area to stay at takes into consideration the logistics for things seen on that day and to be seen the next day.
    6. Type of trip: ${tripDetails} & ${tripType}

    The output format must be like this:

    Day 1:    

    1. [Place 1, City]: (Time to spend in hours) [Must-see!] 
        [Detailed historical/geographical description of the place in at least 300 words] 
       .
       .
    2. [Place 2, City]: (Time to spend in hours) [Must-see!] 
        [Detailed historical/geographical description of the place in at least 300 words] 
       .
       .
   3...

    City/Area to stay at: [Name of city/area]
    Suggested Hotel: [Name of the hotel]
    `
}

{/* Old Prompt  */}
// export const itinenaryPrompt = (dateRange: number, location: string, tripType: "Busy" | "Relaxed", tripDetails: "Cultural" | "Balanced" | "Adventure" | "Sightsee") => {
//     return `Can you create a ${dateRange} day itinerary for ${location} with the following instructions:
//     1. Time to go from one place to the next is the least
//     2. List all places to see in the following manner in a numbered list per-day: <Place to visit : Detailed description in less than 300 words.  
//     3. Also add "Must-see!" if a particular place is a must-see attraction.
//     4. If the place is a hike, also add the elevation gain and length of the hike in a "Hike details: " line. Only include  hikes less than 4 miles long.
//     5. Tell the town/city/area to stay at the end of each day in this format: City/Area to stay at: <Name of city/area>
//     6. Make sure the city/area to stay at takes into consideration the logistics for things seen on that day and to be seen the next day.
//     7. Add a 50-100 word overview section for each day, before starting to list the numbered points.
//     8. Type of trip:${tripType} & ${tripDetails}
//     `
// }

export const nextItinenaryPrompt = (previousResponse: string, location: string) => {
    return `
    ${previousResponse}
    Can you give another itinerary with different places in ${location}  different from the above response with the same information  with same no of days.
    `
}


export const exploreDestinationPrompt = (
    origin: string,
    days: number,
    // tripDetails?: "Beach" | "Mountain" | "Desert" | "Glacier" | "Wildlife" | "Cities",
    tripType?: string,
    month?: string
): string => {
    return `
    "I have only ${days} days for my vacation and would like to start my travel from ${origin}, which is where I live. Consider the number of days to travel from the starting point to the location and back, and specify how I will travel to and from this place in your suggestion. I want my trip to be focused completely on deserts as well as forests, and I'm open to visiting multiple places in the country I will be visiting. I do not want to include international travel, and I plan to travel in ${month} (consider the weather in this month). Make sure that there isn't a ton of driving/travelling that needs to be done, and the trip is relaxed. Can you suggest some itineraries that fits these parameters?"
 
   If a place doesn't meet the parameters, or if time to visit a place is too short, don't show it as a suggestion. If there isn't a single place that meets the parameters, only show this message "I have no suggestions".
 
 
   The answer needs to be in this format:
 
   Suggestion 1: Trip Name
 
   Days A-B: Names of main location(s) to see.
   Paragraph description of what to do and see
 
   Days C-D: Names of main location(s) to see.
   Paragraph description of what to do and see and so on for the request duration of the trip.
 
   Same format for other suggestions that meet the parameters.
    `
}