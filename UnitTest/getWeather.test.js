test('Devolver objeto si el nombre de ciudad existe',async () =>{
    const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=b36342eefc788b8e4ccb10ae5c94bcd3&units=metric&lang=sp`);
    expect(await data.response).toBe('200');
});