(function () {
	
	Monocle.Controls.Magnifier.RESET_STYLESHEET = "";

  var bookData = {
    getComponents: function () {
      return [
        'components/1.html',
        'components/2.html',
        'components/3.html'
      ];
    },
    getContents: function () {
      return [
        {
          title: "The Signal Man",
          src: "components/1.html"
        },
        {
          title: "The Haunted House",
          src: "components/2.html",
          children: [
            {
              title: "Chapter I — The Mortals in the House",
              src: "components/2.html#p2ch1"
            },
            {
              title: "Chapter II — The Ghost in Master B.'s Room",
              src: "components/2.html#p2ch2"
            }
          ]
        },
        {
          title: "The Trial for Murder",
          src: "components/3.html"
        }
      ]
    },
    getComponent: function (componentId) {
      return { url: componentId }
    },
    getMetaData: function(key) {
      return {
        title: "Three Ghost Stories",
        creator: "Charles Dickens"
      }[key];
    }
  }

  // Initialize the reader element.
  Monocle.Events.listen(
    window,
    'load',
    function () {
      var readerOptions = {};

      /* PLACE SAVER */
      var bkTitle = bookData.getMetaData('title');
      var placeSaver = new Monocle.Controls.PlaceSaver(bkTitle);
      readerOptions.place = placeSaver.savedPlace();
      readerOptions.panels = Monocle.Panels.IMode;
			readerOptions.flipper = Monocle.Flippers.Instant;

      /* Initialize the reader */
      window.reader = Monocle.Reader(
        'reader',
        bookData,
        readerOptions,
        function(reader) {
          reader.addControl(placeSaver, 'invisible');

          /* SPINNER */
          var spinner = Monocle.Controls.Spinner(reader);
          reader.addControl(spinner, 'page', { hidden: true });
          spinner.listenForUsualDelays('reader');

          /* Because the 'reader' element changes size on window resize,
           * we should notify it of this event. */
          Monocle.Events.listen(
            window,
            'resize',
            function () { window.reader.resized() }
          );

          /* MAGNIFIER CONTROL */
          var magnifier = new Monocle.Controls.Magnifier(reader);
          reader.addControl(magnifier, 'standard');

					// And the control object being in the variable named 'control'...
					var bookTitle = {};
					bookTitle.createControlElements = function () {
						var cntr = document.createElement('div');
            cntr.className = "bookTitle";
            cntr.innerHTML = '<a class="bookBack" href="/Monocle/test/showcase/">↩</a> <b>' + reader.getBook().getMetaData('title') + '</b> <span class="meta">' + reader.getBook().getMetaData('creator') + '</span';
						return cntr;
					};
					reader.addControl(bookTitle, 'standard');


          /* BOOK TITLE RUNNING HEAD */
          var bookContents = {};
          bookContents.contentsMenu = Monocle.Controls.Contents(reader);
          reader.addControl(bookContents.contentsMenu, 'popover', { hidden: true });
          bookContents.createControlElements = function () {
            var cntr = document.createElement('a');
            cntr.className = "bookContents";
						cntr.setAttribute('href','#_');
            cntr.innerHTML = "❐";

            Monocle.Events.listenForContact(
              cntr,
              {
                start: function (evt) {
                  if (evt.preventDefault) {
                    evt.stopPropagation();
                    evt.preventDefault();
                  } else {
                    evt.returnValue = false;
                  }
                  reader.showControl(bookContents.contentsMenu);
                }
              }
            );

            return cntr;
          }
          reader.addControl(bookContents, 'standard');


          /* CHAPTER TITLE RUNNING HEAD
          var chapterTitle = {
            runners: [],
            createControlElements: function (page) {
              var cntr = document.createElement('div');
              cntr.className = "chapterTitle";
              var runner = document.createElement('div');
              runner.className = "runner";
              cntr.appendChild(runner);
              this.runners.push(runner);
              this.update(page);
              return cntr;
            },
            update: function (page) {
              var place = reader.getPlace(page);
              if (place) {
                this.runners[page.m.pageIndex].innerHTML = place.chapterTitle();
              }
            }
          }
          reader.addControl(chapterTitle, 'page');
          reader.listen(
            'monocle:pagechange',
            function (evt) { chapterTitle.update(evt.m.page); }
          ); */


          /* PAGE NUMBER RUNNING HEAD
          var pageNumber = {
            runners: [],
            createControlElements: function (page) {
              var cntr = document.createElement('div');
              cntr.className = "pageNumber";
              var runner = document.createElement('div');
              runner.className = "runner";
              cntr.appendChild(runner);
              this.runners.push(runner);
              this.update(page);
              return cntr;
            },
            update: function (page, pageNumber) {
              if (pageNumber) {
                this.runners[page.m.pageIndex].innerHTML = pageNumber;
              }
            }
          }
          reader.addControl(pageNumber, 'page');
          reader.listen(
            'monocle:pagechange',
            function (evt) {
              pageNumber.update(evt.m.page, evt.m.pageNumber);
            }
          ); */

          reader.addPageStyles(
						"body {font:16px/1.75 georgia, serif ! important; text-align:justify; color:#000; background:#f2f2f2;}"+
						"p {margin:0; padding:0;}" +
						"p + p {text-indent:1em;}" +
						"h1, h2, h3, h4, h5, h6 {font-weight:normal; text-align:center; text-shadow:1px 1px 0 #fff;}" +
						"h1, h2 {margin:0 0 1.167em; line-height:1.167;}" +
						"h1 {font-size:2.25em;}" +
						"h2 {font-size:1.5em;}" +
						"p + h1, p + h2 {margin:1.167em 0;}" +
						"h3 {margin:0 0 1.333em; font-size:1.3125em; line-height:1.333;}" +
						"p + h3 {margin:1.333em 0;}" +
						"h4 {margin:0 0 1.556em; font-size:1.125em; line-height:1.556;}" +
						"p + h4 {margin:1.556em 0;}" +
						"h5, h6 {margin:0 0 1.175em; font-weight:bold; font-size:1em; line-height:1.75; text-shadow:none;}" +
						"p + h5, p + h6 {margin:1.175em 0;}" +
						"hr {text-align: center; width:50%; margin: 1.75em auto; padding: 2px 0 0; border:none; border-top:1px solid #666; border-bottom:1px solid #666;}" +
						"::-webkit-selection {background:#bff252; text-shadow:none;}" +
						"::-moz-selection {background:#bff252; text-shadow:none;}" +
						"::selection {background:#bff252; text-shadow:none;}"
					);

          /* Scrubber */
          var scrubber = new Monocle.Controls.Scrubber(reader);
          reader.addControl(scrubber, 'standard');
          var showFn = function (evt) {
            evt.stopPropagation();
            reader.showControl(scrubber);
            scrubber.updateNeedles();
          }
          for (var i = 0; i < chapterTitle.runners.length; ++i) {
            Monocle.Events.listenForContact(
              chapterTitle.runners[i].parentNode,
              { start: showFn }
            );
            Monocle.Events.listenForContact(
              pageNumber.runners[i].parentNode,
              { start: showFn }
            );
          }
        }
      );
    }
  );
})();
