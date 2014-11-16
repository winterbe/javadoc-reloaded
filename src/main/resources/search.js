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
        var result = [];
        var tokens = query.split(' ');

        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (!token) {
                continue;
            }

            var idx = token.indexOf(':');
            if (idx < 0) {
                result.push({
                    filter: 'name',
                    value: token
                });
                continue;
            }

            var value = token.slice(idx + 1);
            var filter = token.slice(0, idx);
            result.push({
                filter: filter,
                value: value
            });
        }

        return result;
    };


    var source = function (query, process) {
        if (!query) {
            process([]);
        }

        var suggestions = data;
        var criteria = parseQuery(query);

        _.each(criteria, function (criterion) {
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

        process(suggestions);
    };


    $('#search-input')
        .typeahead({
            highlight: false,
            minLength: 1
        }, {
            displayKey: 'name',
            source: _.debounce(source, 500),
            templates: {
                suggestion: function (o) {
                    return "<p class='name'>" + o.name + "</p>" +
                        "<p class='type'>" + o.fileType + "</p>" +
                        "<p class='package'>" + o.packageName + "</p>";
                }
            }
        })
        .on('typeahead:selected', function (ev, o, ds) {
            $('#content').attr('src', o.path);
        });
});