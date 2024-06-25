$(document).ready(function () {
    // Functionality to load tasks initially and on updates
    function fetchTasks() {
        $.getJSON('/tasks', function (data) {
            $('#task-list').empty();
            data.forEach(function (task, index) {
                const formattedDate = formatDate(task.due_date);
                $('#task-list').append(`
                    <li draggable="true" ondragstart="drag(event)">
                        <span>${task.name} - ${formattedDate}</span>
                        <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
                    </li>
                `);
            });
        });
    }

    // Functionality to delete tasks
    function deleteTask(index) {
        $.ajax({
            url: '/tasks/' + index,
            type: 'DELETE',
            success: function () {
                fetchTasks();
            },
            error: function (xhr, status, error) {
                console.error('Failed to delete task:', error);
            }
        });
    }

    // Functionality to add new task
    $('#task-form').submit(function (event) {
        event.preventDefault();
        const taskName = $('#task-input').val();
        const dueDate = $('#date-input').val();
        $.post('/tasks', { name: taskName, due_date: dueDate }, function () {
            $('#task-input').val('');
            $('#date-input').val('');
            fetchTasks();
        });
    });

    // Initialize fetchTasks function on page load
    fetchTasks();

    // Expose deleteTask function to the global scope
    window.deleteTask = deleteTask;

    // Toggle dark mode/light mode
    $('#dark-mode-toggle').change(function() {
        if ($(this).is(':checked')) {
            $('#app').addClass('dark-mode');
        } else {
            $('#app').removeClass('dark-mode');
        }
    });

    // Function to format dates (similar to your previous implementation)
    function formatDate(dueDate) {
        const today = new Date();
        const date = new Date(dueDate);
        // Implement your formatting logic here
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }
});
