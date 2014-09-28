// designed for multi page modal registration forms
// each page has a continue button, the last page has a close button
// each 'continue' button has a class "step", and an attribute 'data-step="x"',
// where x is the page/step this button is displayed on
// any content that needs to transition between being hidden and shown
// must have the appropriate "step-x" class on it
// events are ('next.m' + for_step)
// events 'next.m.x' are bound to the modal, when these events are triggered,
// the respective buttons responsible for these events will react
// update progress will find progress text and update the class to completed
+function($) {
    'use strict';

    var modals = $('.modal.multi-step');

    modals.each(function(idx, modal) {
        var $modal = $(modal);
        var $buttons = $modal.find('button.step');
        var total_num_steps = $buttons.length;
        var $progress_bar = $modal.find('.m-progress-bar');
        var $progress_stats = $modal.find('.m-progress-stats');
        var $progress_current = $modal.find('.m-progress-current');
        var $progress_total = $modal.find('.m-progress-total');
        var $progress_complete  = $modal.find('.m-progress-complete');

        function getPercentComplete(current_step, total_steps) {
            return current_step / total_steps * 100 + '%';
        }

        function reset() {
            var i = 1;
            for (i = 1; i <= total_num_steps; i++) {
                $('.step-' + i).hide();
            }
        }

        function updateProgress(current, total) {
            $progress_bar.animate({
                width: getPercentComplete(current+1, total)
            });
            if (current === total_num_steps) {
                $progress_stats.hide();
                $progress_complete.show();
            } else {
                $progress_current.text(current + 1);
            }
            var $progress = $('.m-progress');
            var $progress_step = $progress.find('[data-progress=' + current + ']');
            $progress_step.addClass('completed');
        }

        function nextStep(current_step) {
            reset();
            var to_show = $('.step-' + (current_step + 1));
            if (to_show.length === 0) {
                // at the last step, nothing else to show
                return;
            }
            to_show.show();
            updateProgress(current_step, total_num_steps);
        }

        function bindEventsToModal($modal, last) {
            var i,
                delegateToButton = function(e) {
                    $modal.find('button[data-step=' + e.data.step + ']')
                          .trigger('next.m.' + e.data.step);
                };
            for (i = 1; i <= last; i++) {
                $modal.one('next.m.' + i, {step: i}, delegateToButton);
            }
        }

        function bindEventsToButtons() {
            $buttons.each(function() {
                var $b = $(this);
                var for_step = parseInt($b.attr('data-step'), 10);
                if (for_step) {
                    $b.on('next.m.' + for_step, function() {
                        nextStep(for_step);
                    });
                }
            });
        }

        function initialize() {
            reset();
            updateProgress(0, total_num_steps);
            $('.step-1').show();
            $progress_complete.hide();
            $progress_total.text(total_num_steps);
            bindEventsToModal($modal, total_num_steps);
            bindEventsToButtons($buttons);
            $modal.data({
                total_num_steps: $buttons.length,
            });
        }

        initialize();
    })
}(jQuery);
