jQuery(function() {
  var elems = $(document).find('[data-scrollto]');

  if (elems.length) {
    $.each(elems, function (e, el) {
      var target = $(el).data('scrollto');

      $(el).on('click', function (e) {
        $('body').scrollTo(target);
      });
    });
  }

  $('[data-carousel]').each(function () {
    let $carousel = $(this);

    $carousel.data(
      'flkty',
      new Flickity(this, {
        prevNextButtons: false,
        draggable: true,
        pageDots: true,
        groupCells: true,
      })
    );
  });
});
