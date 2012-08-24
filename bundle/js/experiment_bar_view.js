(function() {

  define(['experiment_bar_model', 'dropdown_control'], function(ExperimentBarModel, DropdownControl) {
    var ExperimentBarView;
    return ExperimentBarView = Backbone.View.extend({
      el: $("#selector-test"),
      events: {
        "click .action-buttons .drop-indicator": "actionDropDownClicked",
        "click .action-buttons .extra-actions": "actionSelected",
        "click button#flash": 'flashClicked',
        "click button#touch": 'touchClicked',
        "click button#highlight": 'highlightClicked'
      },
      initialize: function() {
        var _this = this;
        this.actionDropdownView = new DropdownControl.DropdownView();
        this.actionDropdownView.setElement(this.$('.action-buttons'));
        this.actionDropdownView.collection.reset([
          {
            name: 'highlight',
            text: 'Highlight'
          }, {
            name: 'bar',
            text: 'Touch In App'
          }, {
            name: 'baz',
            text: 'Flash In App'
          }
        ]);
        this.actionDropdownView.collection.at(0).select();
        this.engineDropdownView = new DropdownControl.DropdownView();
        this.engineDropdownView.setElement(this.$('.selector-engine'));
        this.engineDropdownView.collection.reset([
          {
            name: 'shelley_compat',
            text: 'Shelley'
          }, {
            name: 'uiquery',
            text: 'UIQuery'
          }
        ]);
        this.engineDropdownView.collection.at(0).select();
        this.$extraActionsList = this.$('.action-buttons .extra-actions');
        this.$selectorInput = this.$('input#query');
        $('body').on('click', function() {
          return _this.$extraActionsList.removeClass('shown');
        });
        this.model = new ExperimentBarModel();
        this.model.on('change', _.bind(this.update, this));
        return this.update();
      },
      update: function() {
        return this.$selectorInput.val(this.model.get('selector'));
      },
      actionDropDownClicked: function(event) {
        event.stopPropagation();
        return this.$extraActionsList.toggleClass('shown');
      },
      actionSelected: function(event) {
        var $currentTopButton, $selectedButton;
        $selectedButton = $(event.target);
        $currentTopButton = this.$('.action-buttons > button');
        if ($selectedButton[0] !== $currentTopButton[0]) {
          $currentTopButton.after($selectedButton);
          return this.$extraActionsList.prepend($currentTopButton);
        }
      },
      updateModelFromSelectorInput: function() {
        return this.model.set('selector', this.$selectorInput.val());
      },
      flashClicked: function() {
        this.updateModelFromSelectorInput();
        return this.model.trigger('flash-clicked');
      },
      touchClicked: function() {
        this.updateModelFromSelectorInput();
        return this.model.trigger('touch-clicked');
      },
      highlightClicked: function() {
        this.updateModelFromSelectorInput();
        return this.model.trigger('highlight-clicked');
      }
    });
  });

}).call(this);
