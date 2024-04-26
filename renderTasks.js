import { sanitizeHtml } from "./sanitizeHtml.js";
import { deleteTodo, postTodo } from "./api.js";
import { format } from "date-fns";

export function renderTasks({ tasks, fetchAndRenderTasks }) {
    const appElement = document.getElementById("app");

    const county = "us";

    const tasksHtml = tasks
        .map((task) => {
            const createDateRu = format(
                new Date(task.created_at),
                "dd/MM/yyyy hh:mm",
            );
            const createDateUs = format(
                new Date(task.created_at),
                "MM-dd-yyyy hh:mm",
            );

            return `
          <li class="task">
              <p class="task-text">
                  ${sanitizeHtml(task.text)} (Создал: ${
                      task.user?.name ?? "Неизвестно"
                  })
                  <button data-id="${
                      task.id
                  }" class="button delete-button">Удалить</button>
              </p>
              <b><i>Задача создана: ${
                  county === "ru" ? createDateRu : createDateUs
              } </i></b>
            </li > `;
        })
        .join("");

    const appHtml = `<h1>Список задач</h1>
    <ul class="tasks" id="list">${tasksHtml}</ul>
    <br />
    <div class="form">
        <h3 class="form-title">Форма добавления</h3>
        <div class="form-row">
            Что нужно сделать:
            <input type="text" id="text-input" class="input" placeholder="Выпить кофе" />
        </div>
        <br />
        <button class="button" id="add-button">Добавить</button>
    </div>`;

    appElement.innerHTML = appHtml;

    const deleteButtons = document.querySelectorAll(".delete-button");

    for (const deleteButton of deleteButtons) {
        deleteButton.addEventListener("click", (event) => {
            event.stopPropagation();

            const id = deleteButton.dataset.id;

            deleteTodo({ id }).then(() => {
                fetchAndRenderTasks();
            });
        });
    }

    const buttonElement = document.getElementById("add-button");
    const textInputElement = document.getElementById("text-input");

    buttonElement.addEventListener("click", () => {
        if (textInputElement.value === "") {
            return;
        }

        buttonElement.disabled = true;
        buttonElement.textContent = "Элемент добавлятся...";

        postTodo({ textInputElement })
            .then(() => {
                return fetchAndRenderTasks();
            })
            .then(() => {
                buttonElement.disabled = false;
                buttonElement.textContent = "Добавить";
                textInputElement.value = "";
            });

        renderTasks({ tasks, fetchAndRenderTasks });
    });
}
