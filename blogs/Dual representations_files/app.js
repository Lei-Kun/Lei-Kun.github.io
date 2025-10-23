$(function () {
    let count = 1;

    $('.footnote').each(function () {
        const $note = $(this);
        const num = count++;
        const content = $note.data('content');

        const $ref = $('<span class="footnote-wrapper">').append(
            $('<sup class="footnote-link">').append(
                $('<a>').attr({tabindex: 0}).text('[' + num + ']')
            )
        );

        $ref.attr({
            'data-animation': 'false',
            'data-toggle': 'popover',
            'data-trigger': 'hover focus',
            'data-placement': 'top',
            'data-content': content
        });

        $note.replaceWith($ref);
    });

    const waitForMathJax = () => new Promise((resolve) => {
        const check = () => (window.MathJax && MathJax.typesetPromise) ? resolve() : setTimeout(check, 25);
        check();
    });

    waitForMathJax().then(() => {
        const jobs = [];
        document.querySelectorAll('span[data-toggle="popover"]').forEach((popover) => {
            const div = document.createElement('div');
            div.style.cssText = 'position:absolute; top:-9999px; left:-9999px; width:auto; height:auto; overflow:hidden; visibility:hidden;';
            div.innerHTML = popover.getAttribute('data-content') || '';
            document.body.appendChild(div);

            jobs.push(
                MathJax.typesetPromise([div]).then(() => {
                    popover.setAttribute('data-content', div.innerHTML);
                    div.remove();
                })
            );
        });

        return Promise.all(jobs);
    }).then(() => {
        $('[data-toggle="popover"]').popover({
            html: true,
            container: 'body'
        });
    }).catch((e) => {
        // console.error('MathJax init/typeset failed', e);
    });
});