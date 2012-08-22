(function() {

  define(['view_heir_model'], function(ViewHeirModel) {
    var TreeNodeView, TreeView;
    TreeNodeView = Backbone.View.extend({
      tagName: 'li',
      title: function() {
        var label, viewClass;
        viewClass = this.model.get('class');
        if (label = this.model.get('accessibilityLabel')) {
          return "" + viewClass + ": " + label;
        } else {
          return viewClass;
        }
      },
      render: function() {
        var $childList, child, childView, _i, _len, _ref;
        $childList = $("<ul/>");
        _ref = this.model.get('children');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          childView = new TreeNodeView({
            model: child
          });
          $childList.append(childView.render().el);
        }
        this.$el.append("<a>" + (this.title()) + "</a>").append($childList);
        return this;
      }
    });
    return TreeView = Backbone.View.extend({
      el: $('#dom-dump > ul'),
      initialize: function() {
        this.model = new ViewHeirModel();
        return this.model.on('change', _.bind(this.refresh, this));
      },
      refresh: function() {
        var rootNodeView;
        this.$el.empty();
        rootNodeView = new TreeNodeView({
          model: this.model.get('root')
        });
        this.$el.append(rootNodeView.render().el);
        return this.$el.treeview({
          collapsed: false
        });
      }
    });
  });

}).call(this);
