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
        var criteria = [];
        var sort = 'alphabetic';

        if (!query) {
            return {
                criteria: criteria,
                sort: sort
            };
        }

        query = query.trim();
        var tokens = query.split(' ');

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

    var now = function () {
        if (Date.now) {
            return Date.now();
        }
        return new Date().getTime();
    };

    var renderSearchResults = function (suggestions) {
        var t0 = now();

        var $sidebar = $('.sidebar');
        $sidebar.html('');
        $sidebar.scrollTop();

        _.each(suggestions, function (suggestion) {
            $('<a>')
                .attr('href', suggestion.path)
                .attr('target', 'javadoc')
                .text(suggestion.name)
                .addClass(suggestion.fileType.toLowerCase())
                .appendTo($sidebar);
        });

        console.log('rendering took %dms', now() - t0);
    };

    var doSearch = function (query) {
        console.log('searching javadoc for query: %s', query);

        var t0 = now();

        var searchResults = data;

        var parsedQuery = parseQuery(query);

        _.each(parsedQuery.criteria, function (criterion) {
            if (searchResults.length > 0) {
                var filter = filters[criterion.filter];
                var val = criterion.value;
                if (!val) {
                    searchResults = [];
                } else if (filter) {
                    searchResults = filter(val, searchResults);
                }
            }
        });

        // get rid of corba stuff
        if (query.toLowerCase().indexOf('corba') < 0 || query.toLowerCase().indexOf('omg') < 0) {
            searchResults = _.filter(searchResults, function (o) {
                return o['packageName'].indexOf('org.omg') < 0;
            });
        }

        if (parsedQuery.sort === 'relevance') {
            searchResults.sort(function (a, b) {
                var name1 = a.name.toLowerCase();
                var name2 = b.name.toLowerCase();

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
            searchResults.sort(function (a, b) {
                var name1 = a.name.toLowerCase();
                var name2 = b.name.toLowerCase();

                if (name1 < name2) {
                    return -1
                }

                if (name1 === name2) {
                    return 0;
                }

                return 1;
            });
        }

        console.log('search took %dms', now() - t0);

        renderSearchResults(searchResults);

        if (localStorage) {
            localStorage.setItem("query", query);
        }
    };

    var search = _.debounce(doSearch, 250);

    var query = localStorage ? localStorage.getItem('query') || '' : '';
    search(query, renderSearchResults);

    $('#search-input')
        .on('keyup', function (ev) {
            if (ev.keyCode === 13) {
                search($(this).val());
            }
        })
        .val(query);
});