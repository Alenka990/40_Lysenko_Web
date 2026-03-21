(function() 
{
    window.StorageManager = 
    {
        set: function(key, value) 
        {
            localStorage.setItem(key, JSON.stringify(value));
        },
        get: function(key) 
        {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        }
    };
    
    class Card 
    {
        #id;
        #name;
        #description;
        #cost;
        
        constructor(id, name, description, cost) 
        {
            this.#id = id;
            this.#name = name.trim();
            this.#description = description.trim();
            this.#cost = cost;
        }
        
        getId() { return this.#id; }
        getName() { return this.#name; }
        
        getHTML(small = true) 
        {
            let html = 
            `
                <div class="card" data-id="${this.#id}">
                    <div class="card-content">
                        <div class="card-title">${this.#escapeHtml(this.#name)}</div>
                        <div class="card-type">${this.getTypeLabel()}</div>
                        <div class="card-desc">${this.#escapeHtml(this.#description)}</div>
            `;
            
            if (!small) 
            {
                html += this.getFullStatsHTML();
            } 
            else 
            {
                html += `<div class="card-stats">💰 ${this.#cost} маны</div>`;
            }
            
            html += `</div></div>`;
            return html;
        }
        
        getFullStatsHTML() 
        {
            return `
                <div class="popup-stats">
                    <strong>💰 Стоимость:</strong> ${this.#cost} маны<br>
                    ${this.getAdditionalStats()}
                </div>
            `;
        }
        
        getTypeLabel() { return "Карта"; }
        getAdditionalStats() { return ""; }
        
        #escapeHtml(str) 
        {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }
        
        toJSON() 
        {
            return {
                classType: this.constructor.name,
                id: this.#id,
                name: this.#name,
                description: this.#description,
                cost: this.#cost
            };
        }
    }
    
    class CreatureCard extends Card 
    {
        #attack;
        #health;
        
        constructor(id, name, description, cost, attack, health) 
        {
            super(id, name, description, cost);
            this.#attack = attack;
            this.#health = health;
        }
        
        getTypeLabel() { return "⚔️ Существо"; }
        
        getAdditionalStats() 
        {
            return `<strong>⚔️ Атака:</strong> ${this.#attack} &nbsp;|&nbsp; <strong>🛡️ Здоровье:</strong> ${this.#health}`;
        }
        
        toJSON() 
        {
            return {
                ...super.toJSON(),
                attack: this.#attack,
                health: this.#health
            };
        }
    }
    
    class SpellCard extends Card 
    {
        #effect;
        
        constructor(id, name, description, cost, effect) 
        {
            super(id, name, description, cost);
            this.#effect = effect;
        }
        
        getTypeLabel() { return "✨ Заклинание"; }
        
        getAdditionalStats() 
        {
            return `<strong>✨ Эффект:</strong> ${this.#escapeHtml(this.#effect)}`;
        }
        
        #escapeHtml(str) 
        {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }
        
        toJSON() 
        {
            return {
                ...super.toJSON(),
                effect: this.#effect
            };
        }
    }
    
    class RelicCard extends Card 
    {
        #passive;
        
        constructor(id, name, description, cost, passive) 
        {
            super(id, name, description, cost);
            this.#passive = passive;
        }
        
        getTypeLabel() { return "🏺 Реликвия"; }
        
        getAdditionalStats() 
        {
            return `<strong>🏺 Пассивка:</strong> ${this.#escapeHtml(this.#passive)}`;
        }
        
        #escapeHtml(str) 
        {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }
        
        toJSON() 
        {
            return {
                ...super.toJSON(),
                passive: this.#passive
            };
        }
    }
    
    let deck = [];
    let isEditMode = false;
    let nextId = 10;
    
    const defaultDeckData = [
        { classType: "CreatureCard", id: 1, name: "Пламенный Страж", description: "Огненный воин, защищающий слабых", cost: 3, attack: 4, health: 6 },
        { classType: "CreatureCard", id: 2, name: "Ледяная Фурия", description: "Морозный дух, замораживающий врагов", cost: 4, attack: 5, health: 4 },
        { classType: "SpellCard", id: 3, name: "Огненный Шар", description: "Сгусток пламени, испепеляющий врагов", cost: 2, effect: "Наносит 3 урона всем противникам" },
        { classType: "SpellCard", id: 4, name: "Исцеляющий Шепот", description: "Тихий шёпот восстанавливает силы", cost: 1, effect: "Восстанавливает 5 здоровья цели" },
        { classType: "RelicCard", id: 5, name: "Амулет Древних", description: "Древний артефакт с неизвестной силой", cost: 3, passive: "В начале хода даёт +1 к силе" },
        { classType: "CreatureCard", id: 6, name: "Ночной Странник", description: "Тень, скользящая во тьме", cost: 2, attack: 3, health: 3 },
        { classType: "SpellCard", id: 7, name: "Молния", description: "Разряд молнии с небес", cost: 3, effect: "Наносит 4 урона случайному врагу" },
        { classType: "RelicCard", id: 8, name: "Корона Короля", description: "Символ власти над душами", cost: 4, passive: "Каждые 3 хода даёт дополнительную карту" },
        { classType: "CreatureCard", id: 9, name: "Каменный Голем", description: "Непробиваемая каменная стена", cost: 5, attack: 3, health: 9 }
    ];
    
    function createCardFromData(data) 
    {
        switch (data.classType) 
        {
            case "CreatureCard":
                return new CreatureCard(data.id, data.name, data.description, data.cost, data.attack, data.health);
            case "SpellCard":
                return new SpellCard(data.id, data.name, data.description, data.cost, data.effect);
            case "RelicCard":
                return new RelicCard(data.id, data.name, data.description, data.cost, data.passive);
            default:
                return new Card(data.id, data.name, data.description, data.cost);
        }
    }
    
    function loadDeck() 
    {
        const saved = StorageManager.get('arcanumDeck');
        if (saved && Array.isArray(saved) && saved.length > 0) 
        {
            deck = saved.map(createCardFromData);
            const maxId = Math.max(...deck.map(c => c.getId()), 0);
            nextId = maxId + 1;
        } 
        else 
        {
            deck = defaultDeckData.map(createCardFromData);
            nextId = 10;
        }
        renderDeck();
    }
    
    function saveDeck() 
    {
        StorageManager.set('arcanumDeck', deck.map(card => card.toJSON()));
    }
    
    function buildSite() 
    {
        document.body.innerHTML = 
        `
            <header>
                <h1>⚔️ ДУЭЛЬ АРКАНУМ ⚔️</h1>
                <div style="display: flex; gap: 12px;">
                    <button class="reset-btn" id="resetBtn">🔄 Сброс</button>
                    <button class="edit-toggle" id="editToggle">✎ Режим просмотра</button>
                </div>
            </header>
            <main class="main-content">
                <div class="deck-container" id="deckContainer"></div>
                <button class="addcard-btn" id="addCardBtn">➕ НОВАЯ КАРТА</button>
            </main>
            <footer>
                <p>Собери свою колоду и побеждай в Дуэли Арканум</p>
            </footer>
            <div class="popup-overlay" id="viewPopup">
                <div class="popup-card">
                    <button class="close-btn" onclick="window.hidePopup && hidePopup()">✕</button>
                    <div id="popupContent" class="popup-content"></div>
                </div>
            </div>
        `;
        
        document.getElementById("editToggle").addEventListener("click", toggleEditMode);
        document.getElementById("resetBtn").addEventListener("click", resetDeck);
        document.getElementById("addCardBtn").addEventListener("click", addNewCard);
        
        loadDeck();
    }
    
    function renderDeck() 
    {
        const container = document.getElementById("deckContainer");
        if (!container) return;
        
        container.innerHTML = '';
        
        deck.forEach((card, index) => 
        {
            const div = document.createElement("div");
            div.innerHTML = card.getHTML(true);
            const cardElement = div.firstElementChild;
            
            cardElement.onclick = (e) => 
            {
                if (!isEditMode && !e.target.closest('.card-controls')) 
                {
                    showCardPopup(card);
                }
            };
            
            if (isEditMode) 
            {
                const controls = document.createElement("div");
                controls.className = "card-controls";
                controls.innerHTML = 
                `
                    <button onclick="window.editCard && editCard(${index}); event.stopPropagation();">✎</button>
                    <button onclick="window.deleteCard && deleteCard(${index}); event.stopPropagation();">🗑</button>
                `;
                cardElement.appendChild(controls);
            }
            
            container.appendChild(cardElement);
        });
    }
    
    window.showCardPopup = function(card) 
    {
        const popup = document.getElementById("viewPopup");
        const content = document.getElementById("popupContent");
        content.innerHTML = card.getHTML(false);
        popup.classList.add("active");
    };
    
    window.hidePopup = function() 
    {
        const popup = document.getElementById("viewPopup");
        if (popup) popup.classList.remove("active");
    };
    
    function toggleEditMode() 
    {
        isEditMode = !isEditMode;
        const btn = document.getElementById("editToggle");
        const addBtn = document.getElementById("addCardBtn");
        
        if (isEditMode) 
        {
            btn.textContent = "✓ Режим редактирования";
            btn.style.background = "#ffb347";
            if (addBtn) addBtn.style.display = "block";
        } 
        else 
        {
            btn.textContent = "✎ Режим просмотра";
            btn.style.background = "#7b2cbf";
            if (addBtn) addBtn.style.display = "none";
        }
        
        renderDeck();
    }
    
    window.resetDeck = function() 
    {
        if (confirm("Сбросить колоду к стандартному набору? Все изменения пропадут!")) 
        {
            localStorage.removeItem('arcanumDeck');
            location.reload();
        }
    };
    
    function validateInput(promptText, defaultValue = "", validator = (s) => s && s.trim() !== "") 
    {
        let input;
        do 
        {
            input = prompt(promptText, defaultValue);
            if (input === null) return null;
            input = input.trim();
            if (!validator(input)) 
            {
                alert("Некорректный ввод, попробуй ещё раз");
            }
        } 
        while (!validator(input));
        return input;
    }
    
    function validateNumber(promptText, defaultValue = "") 
    {
        let input;
        do 
        {
            input = prompt(promptText, defaultValue);
            if (input === null) return null;
            input = input.trim();
            const num = parseInt(input);
            if (!isNaN(num) && num >= 0) 
            {
                return num;
            }
            alert("Введи число (0 и больше)");
        } 
        while (true);
    }
    
    window.editCard = function(index) 
    {
        const card = deck[index];
        const data = card.toJSON();
        
        const newName = validateInput("Название карты:", data.name);
        if (newName === null) return;
        
        const newDesc = validateInput("Описание карты:", data.description);
        if (newDesc === null) return;
        
        const newCost = validateNumber("Стоимость маны:", data.cost);
        if (newCost === null) return;
        
        let newCard;
        
        if (card instanceof CreatureCard) 
        {
            const newAttack = validateNumber("Атака:", data.attack);
            if (newAttack === null) return;
            const newHealth = validateNumber("Здоровье:", data.health);
            if (newHealth === null) return;
            newCard = new CreatureCard(data.id, newName, newDesc, newCost, newAttack, newHealth);
        } 
        else if (card instanceof SpellCard) 
        {
            const newEffect = validateInput("Эффект заклинания:", data.effect);
            if (newEffect === null) return;
            newCard = new SpellCard(data.id, newName, newDesc, newCost, newEffect);
        } 
        else if (card instanceof RelicCard) 
        {
            const newPassive = validateInput("Пассивная способность:", data.passive);
            if (newPassive === null) return;
            newCard = new RelicCard(data.id, newName, newDesc, newCost, newPassive);
        } 
        else 
        {
            newCard = new Card(data.id, newName, newDesc, newCost);
        }
        
        deck[index] = newCard;
        saveDeck();
        renderDeck();
        alert("Карта обновлена!");
    };
    
    window.deleteCard = function(index) 
    {
        if (confirm("Удалить карту из колоды?")) 
        {
            deck.splice(index, 1);
            saveDeck();
            renderDeck();
            alert("Карта удалена");
        }
    };
    
    function addNewCard() 
    {
        const typeChoice = prompt("Выбери тип карты:\n1 - Существо\n2 - Заклинание\n3 - Реликвия");
        if (!typeChoice) return;
        
        const name = validateInput("Название карты:");
        if (name === null) return;
        
        const description = validateInput("Описание карты:");
        if (description === null) return;
        
        const cost = validateNumber("Стоимость маны:");
        if (cost === null) return;
        
        let newCard;
        
        if (typeChoice === "1" || typeChoice.toLowerCase() === "существо") 
        {
            const attack = validateNumber("Атака:");
            if (attack === null) return;
            const health = validateNumber("Здоровье:");
            if (health === null) return;
            newCard = new CreatureCard(nextId++, name, description, cost, attack, health);
        } 
        else if (typeChoice === "2" || typeChoice.toLowerCase() === "заклинание") 
        {
            const effect = validateInput("Эффект заклинания:");
            if (effect === null) return;
            newCard = new SpellCard(nextId++, name, description, cost, effect);
        } 
        else if (typeChoice === "3" || typeChoice.toLowerCase() === "реликвия") 
        {
            const passive = validateInput("Пассивная способность:");
            if (passive === null) return;
            newCard = new RelicCard(nextId++, name, description, cost, passive);
        } 
        else 
        {
            alert("Неверный выбор типа");
            return;
        }
        
        deck.unshift(newCard);
        saveDeck();
        renderDeck();
        alert("Новая карта добавлена в колоду!");
    }
    
    buildSite();
})();