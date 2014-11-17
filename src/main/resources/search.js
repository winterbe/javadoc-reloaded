$(function () {
    "use strict";

    var data = '{{DATA}}';

    var filters = {
        'name': function (val, items) {
            return _.filter(items, function (o) {
                return o['name'].toLowerCase().indexOf(val) > -1;
            });
        },
        'package': function (val, items) {
            return _.filter(items, function (o) {
                return o['packageName'].toLowerCase().indexOf(val) > -1;
            });
        },
        'version': function (val, items) {
            return _.filter(items, function (o) {
                return o['version'].toLowerCase().indexOf(val) > -1;
            });
        },
        'extends': function (val, items) {
            return _.filter(items, function (o) {
                return o['filterExtends'].indexOf(val) > -1;
            });
        },
        'is': function (val, items) {
            return _.filter(items, function (o) {
                return o['filterIs'].indexOf(val) > -1;
            });
        }
    };

    // aliases
    filters['pkg'] = filters['package'];
    filters['from'] = filters['package'];
    filters['in'] = filters['package'];
    filters['since'] = filters['version'];
    filters['sub'] = filters['extends'];

    var parseQuery = function (query) {
        query = query.trim();
        var criteria = [];
        var tokens = query.split(' ');
        var sort = 'alphabetic';

        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (!token) {
                continue;
            }

            var idx = token.indexOf(':');
            if (idx < 0) {
                criteria.push({
                    filter: 'name',
                    value: token.toLowerCase()
                });
                sort = 'relevance';
                continue;
            }

            var value = token.slice(idx + 1).toLowerCase();
            var filter = token.slice(0, idx).toLocaleLowerCase();

            // aliases
            if (filter === 'is' && (value === 'fn' || value === 'lambda')) {
                value = 'functional';
            }

            criteria.push({
                filter: filter,
                value: value
            });
        }

        return {
            criteria: criteria,
            sort: sort
        };
    };

    var updateSidebar = function (suggestions) {
        var $sidebar = $('.sidebar');
        $sidebar.html('');

        _.each(suggestions, function (suggestion) {
            $('<a>')
                .attr('href', suggestion.path)
                .attr('target', 'javadoc')
                .text(suggestion.name)
                .appendTo($sidebar);
        });
    };

    var source = function (query, process) {
        var suggestions = data;

        if (query) {
            var parsedQuery = parseQuery(query);

            _.each(parsedQuery.criteria, function (criterion) {
                if (suggestions.length > 0) {
                    var filter = filters[criterion.filter];
                    var val = criterion.value;
                    if (!val) {
                        suggestions = [];
                    } else if (filter) {
                        suggestions = filter(val, suggestions);
                    }
                }
            });
        }

        if (parsedQuery && parsedQuery.sort === 'relevance') {
            suggestions.sort(function (a, b) {
                var name1 = a.name;
                var name2 = b.name;

                if (name1.length < name2.length) {
                    return -1
                }

                if (name1.length > name2.length) {
                    return 1;
                }

                if (name1 < name2) {
                    return -1
                }

                if (name1 > name2) {
                    return 1;
                }

                return 0;
            });
        } else {
            suggestions.sort(function (a, b) {
                var name1 = a.name;
                var name2 = b.name;

                if (name1 < name2) {
                    return -1
                }

                if (name1 === name2) {
                    return 0;
                }

                return 1;
            });
        }

        process(suggestions);
    };


    $('#search-input')
        .on('keyup', function (ev) {
            if (ev.keyCode === 13) {
                var query = $(this).val();
                source(query, _.debounce(updateSidebar, 250, true));
            }
        });
});