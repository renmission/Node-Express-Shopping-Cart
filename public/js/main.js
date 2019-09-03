ClassicEditor
    .create(document.querySelector('#ta'))
    .catch(error => {
        console.error(error);
    });

$(function() {
    $('a.confirmDeletion').on('click', function(e) {
        if (!confirm('Confirm Deletion')) return false;
    });
});