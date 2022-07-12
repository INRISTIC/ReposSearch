class View {
  constructor() {
    this.app = document.getElementById('app');

    this.searchLine = this.createElement('div', "search-line");
    this.searchInput = this.createElement('input', "search-input")
    this.searchLine.append(this.searchInput);

    this.reposWrapper = this.createElement('div', 'repos-wrapper')

    this.reposList = this.createElement('ul', 'repos-list')
    this.reposList.id = 'inputList';

    this.reposListHistory = this.createElement('ul', 'repos-list-history')
    this.reposListHistory.id = 'inputListHistory';

    this.reposWrapper.append(this.reposList)
    this.reposWrapper.append(this.reposListHistory)
      
    this.main = this.createElement('div', 'main')
    this.main.append(this.reposWrapper)

    this.app.append(this.searchLine);
    this.app.append(this.main);

    this.count = 0
  }
  createElement(elementTag, elementClass, elementId) {
    const element = document.createElement(elementTag);
    if(elementClass) {
        element.classList.add(elementClass)
    }

    if (arguments.length > 2) {
        element.id = elementId;
    }
    return element;
}

createUser(reposData) {
    const userElement = this.createElement('li', 'user-prev')
    const userElementHistory = this.createElement('li', 'user-prev-history')
    const spanEl = this.createElement('span', 'close');
    spanEl.addEventListener('click', () => {
        userElementHistory.remove();
    })
    spanEl.removeEventListener('click', () => {
      userElementHistory.remove();
  })
    userElement.innerHTML = `<div>${reposData.name}</div>`;
    userElement.addEventListener('click', () => {
        userElementHistory.innerHTML = `<div>Name: ${reposData.name}</div><div>Owner: ${reposData.owner.login}</div><div>Stars: ${reposData.stargazers_count}</div>`;
        userElementHistory.append(spanEl)
        this.reposListHistory.append(userElementHistory)
    })

    this.reposList.append(userElement);
  }
}

class Search {
  constructor(view) {
    this.view = view;
    this.debounce = (fn, ms) => {
      let timeout;
      return function () {
        const fnCall = () => { fn.apply(this, arguments)}
        clearTimeout(timeout);
        timeout = setTimeout(fnCall, ms)
      }
    }
    this.view.searchInput.addEventListener('input', this.debounce(this.searchRepos.bind(this), 1000))
 }
  async searchRepos() {
    return await fetch(`https://api.github.com/search/repositories?q=${this.view.searchInput.value}`).then((res) => {
        if (res.ok) {
            res.json().then(res => {
                document.getElementById("inputList").innerHTML = "";
                if (res.items.length < 5) {
                    res.items.forEach(user => this.view.createUser(user))
                } else {
                    for (let i = 0; i < 5; i++) {
                        this.view.createUser(res.items[i]);
                    }
                }
            })
        }
    })
}
}

new Search(new View)
