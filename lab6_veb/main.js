(function() {
    let текущаяВкладка = 'posts';
    
    const адреса = {
        посты: 'https://jsonplaceholder.typicode.com/posts',
        пользователи: 'https://jsonplaceholder.typicode.com/users',
        факты: 'https://catfact.ninja/facts?limit=10'
    };
    
    const контейнер = document.getElementById('content');
    
    function показатьЗагрузку() {
        контейнер.innerHTML = '<div class="loading">Загрузка...</div>';
    }
    
    function показатьОшибку(текст) {
        контейнер.innerHTML = `<div class="error">❌ Ошибка: ${текст}</div>`;
    }
    
    function показатьПусто(текст) {
        контейнер.innerHTML = `<div class="empty">📭 ${текст}</div>`;
    }
    
    async function запрос(url, параметры = {}) {
        const ответ = await fetch(url, параметры);
        if (!ответ.ok) throw new Error(`HTTP ${ответ.status}`);
        return await ответ.json();
    }
    
    function защитить(текст) {
        if (!текст) return '';
        const div = document.createElement('div');
        div.textContent = текст;
        return div.innerHTML;
    }
    
    // ===== ПОСТЫ =====
    async function загрузитьПосты() {
        показатьЗагрузку();
        try {
            const посты = await запрос(адреса.посты + '?_limit=8');
            if (!посты || посты.length === 0) {
                показатьПусто('Посты не найдены');
                return;
            }
            
            let html = `
                <div class="form-box" id="формаПоста" style="display: none;">
                    <input type="text" id="заголовок" placeholder="Заголовок">
                    <textarea id="текстПоста" rows="3" placeholder="Текст поста"></textarea>
                    <div class="form-buttons">
                        <button class="cancel" id="отменаПоста">Отмена</button>
                        <button class="submit" id="создатьПост">Создать</button>
                    </div>
                </div>
                <button class="refresh-btn" id="показатьФорму">+ Создать пост</button>
                <div class="posts-list" id="списокПостов"></div>
            `;
            контейнер.innerHTML = html;
            
            const список = document.getElementById('списокПостов');
            отрисоватьПосты(посты, список);
            
            document.getElementById('показатьФорму').onclick = () => {
                const форма = document.getElementById('формаПоста');
                форма.style.display = форма.style.display === 'none' ? 'block' : 'none';
            };
            document.getElementById('отменаПоста').onclick = () => {
                document.getElementById('формаПоста').style.display = 'none';
                document.getElementById('заголовок').value = '';
                document.getElementById('текстПоста').value = '';
            };
            document.getElementById('создатьПост').onclick = создатьПост;
        } catch (err) {
            показатьОшибку(err.message);
        }
    }
    
    function отрисоватьПосты(посты, список) {
        список.innerHTML = '';
        посты.forEach(пост => {
            const блок = document.createElement('div');
            блок.className = 'post';
            блок.innerHTML = `
                <h3>📌 ${защитить(пост.title)}</h3>
                <p>${защитить(пост.body)}</p>
                <div class="post-buttons">
                    <button class="edit-btn" data-id="${пост.id}">✎</button>
                    <button class="delete-btn" data-id="${пост.id}">🗑</button>
                </div>
            `;
            список.appendChild(блок);
        });
        
        document.querySelectorAll('.edit-btn').forEach(кнопка => {
            кнопка.onclick = () => редактироватьПост(parseInt(кнопка.dataset.id));
        });
        document.querySelectorAll('.delete-btn').forEach(кнопка => {
            кнопка.onclick = () => удалитьПост(parseInt(кнопка.dataset.id));
        });
    }
    
    async function создатьПост() {
        const заголовок = document.getElementById('заголовок').value.trim();
        const текст = document.getElementById('текстПоста').value.trim();
        if (!заголовок || !текст) {
            alert('Заполните все поля');
            return;
        }
        try {
            await запрос(адреса.посты, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: заголовок, body: текст, userId: 1 })
            });
            alert('Пост создан!');
            document.getElementById('формаПоста').style.display = 'none';
            document.getElementById('заголовок').value = '';
            document.getElementById('текстПоста').value = '';
            загрузитьПосты();
        } catch (err) {
            alert('Ошибка: ' + err.message);
        }
    }
    
    async function редактироватьПост(id) {
        const новыйЗаголовок = prompt('Новый заголовок:');
        if (!новыйЗаголовок) return;
        const новыйТекст = prompt('Новый текст:');
        if (!новыйТекст) return;
        try {
            await запрос(`${адреса.посты}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, title: новыйЗаголовок, body: новыйТекст, userId: 1 })
            });
            alert('Пост обновлён!');
            загрузитьПосты();
        } catch (err) {
            alert('Ошибка: ' + err.message);
        }
    }
    
    async function удалитьПост(id) {
        if (!confirm('Удалить пост?')) return;
        try {
            await запрос(`${адреса.посты}/${id}`, { method: 'DELETE' });
            alert('Пост удалён!');
            загрузитьПосты();
        } catch (err) {
            alert('Ошибка: ' + err.message);
        }
    }
    
    // ===== ПОЛЬЗОВАТЕЛИ =====
    async function загрузитьПользователей() {
        показатьЗагрузку();
        try {
            const пользователи = await запрос(адреса.пользователи);
            if (!пользователи || пользователи.length === 0) {
                показатьПусто('Пользователи не найдены');
                return;
            }
            let html = `<div class="users-grid" id="сеткаПользователей"></div>`;
            контейнер.innerHTML = html;
            const сетка = document.getElementById('сеткаПользователей');
            пользователи.forEach(пользователь => {
                const карточка = document.createElement('div');
                карточка.className = 'user-card';
                карточка.innerHTML = `
                    <h4>${защитить(пользователь.name)}</h4>
                    <p>${защитить(пользователь.email)}</p>
                    <p>${защитить(пользователь.company?.name || '—')}</p>
                `;
                сетка.appendChild(карточка);
            });
        } catch (err) {
            показатьОшибку(err.message);
        }
    }
    
    // ===== ФАКТЫ =====
    async function загрузитьФакты() {
        показатьЗагрузку();
        try {
            const данные = await запрос(адреса.факты);
            if (!данные || !данные.data || данные.data.length === 0) {
                показатьПусто('Факты не найдены');
                return;
            }
            let html = `
                <button class="refresh-btn" id="обновитьФакты">🔄 Обновить</button>
                <div class="facts-list" id="списокФактов"></div>
            `;
            контейнер.innerHTML = html;
            отрисоватьФакты(данные.data);
            document.getElementById('обновитьФакты').onclick = загрузитьФакты;
        } catch (err) {
            показатьОшибку(err.message);
        }
    }
    
    function отрисоватьФакты(факты) {
        const список = document.getElementById('списокФактов');
        if (!список) return;
        список.innerHTML = '';
        факты.forEach(факт => {
            const блок = document.createElement('div');
            блок.className = 'fact';
            блок.innerHTML = `
                <p>🐱 ${защитить(факт.fact)}</p>
            `;
            список.appendChild(блок);
        });
    }
    
    // ===== ПЕРЕКЛЮЧЕНИЕ =====
    async function переключитьВкладку(вкладка) {
        текущаяВкладка = вкладка;
        document.querySelectorAll('.tab').forEach(кнопка => {
            if (кнопка.dataset.tab === вкладка) {
                кнопка.classList.add('active');
            } else {
                кнопка.classList.remove('active');
            }
        });
        
        if (вкладка === 'posts') await загрузитьПосты();
        else if (вкладка === 'users') await загрузитьПользователей();
        else if (вкладка === 'facts') await загрузитьФакты();
    }
    
    function запуск() {
        document.querySelectorAll('.tab').forEach(кнопка => {
            кнопка.addEventListener('click', () => переключитьВкладку(кнопка.dataset.tab));
        });
        переключитьВкладку('posts');
    }
    
    запуск();
})();