function renderArtists(type,data){
    const list = document.createElement('ul');

    for (const artist of data){
        const name = artist.name;
        const works = artist.works.join(',');

        const listItem = 
    document.createElement('li');
        const heading =
    document.createElement('h2');
        const body =
    document.createElement('p');

        heading.textContent = name;
        body.textContent = works;

        listItem.appendChild(heading);
        listItem.appendChild(body);

        list.appendChild(listItem);

    }

    document.body.appendChild(list);
}