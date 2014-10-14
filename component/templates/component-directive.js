/**
 * <%= name %> directive.
 */

<%= appname %>.<%= name %>.<%= name %>Directive = function() {
    return { template: '[<%= name %>]' };
};

<%= appname %>.<%= name %>.directive('<%= name %>', <%= appname %>.<%= name %>.<%= name %>Directive);