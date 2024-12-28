module.exports = async (urlApi) => {
    try {
        const response = await fetch(urlApi);
        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
        
        const data = await response.json();
        return data;

    } catch (error) {
        console.error(`Error fetching api request: ${error}`);
        return null;
    }
}