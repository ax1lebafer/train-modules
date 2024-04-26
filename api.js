let todosUrl = "https://wedev-api.sky.pro/api/v2/todos";
let userUrl = "https://wedev-api.sky.pro/api/user/login";

export let token;

export function setToken(newToken) {
    token = newToken;
}

export function getTodos() {
    return fetch(todosUrl, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then((response) => {
        if (response.status === 401) {
            throw new Error("Нет авторизации");
        }
        return response.json();
    });
}

export function postTodo({ textInputElement }) {
    return fetch(todosUrl, {
        method: "POST",
        body: JSON.stringify({
            text: textInputElement.value,
        }),
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then((response) => {
        return response.json();
    });
}

export function deleteTodo({ id }) {
    return fetch(todosUrl + "/" + id, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then((response) => {
        return response.json();
    });
}

export function login({ login, password }) {
    return fetch(userUrl, {
        method: "POST",
        body: JSON.stringify({
            login,
            password,
        }),
    })
        .then((response) => {
            if (response.status === 400) {
                throw new Error("Не верно введены данные");
            }

            return response.json();
        })
        .catch((error) => {
            alert(error);
        });
}
