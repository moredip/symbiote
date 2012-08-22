(function() {

  define(['view_heir_model'], function(ViewHeirModel) {
    var TreeNodeView, TreeView;
    TreeNodeView = Backbone.View.extend({
      tagName: 'li',
      render: function() {
        var $childList, child, childView, _i, _len, _ref,
          _this = this;
        $childList = $("<ul/>");
        _ref = this.model.get('children');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          childView = new TreeNodeView({
            model: child
          });
          $childList.append(childView.render().el);
        }
        this.$el.append("<a>" + (this.model.getDesc()) + "</a>").append($childList);
        this.$('> a').on('mouseenter', function() {
          return _this.model.set('active', true);
        }).on('mouseleave', function() {
          return _this.model.set('active', false);
        });
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
