/**
 * This file is part of Graylog.
 *
 * Graylog is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Graylog is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Graylog.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.graylog2.indexer.searches;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.auto.value.AutoValue;
import org.graylog2.indexer.searches.timeranges.TimeRange;

import javax.annotation.Nullable;
import java.util.List;

@AutoValue
public abstract class SearchesConfig {
    private final static int LIMIT = 150;

    @JsonProperty
    public abstract String query();

    @JsonProperty
    @Nullable
    public abstract String filter();

    @JsonProperty
    @Nullable
    public abstract List<String> fields();

    @JsonProperty
    public abstract TimeRange range();

    @JsonProperty
    public abstract int limit();

    @JsonProperty
    public abstract int offset();

    @JsonProperty
    @Nullable
    public abstract Sorting sorting();

    @JsonCreator
    public SearchesConfig create(@JsonProperty("query") String query,
                                 @JsonProperty("filter") @Nullable String filter,
                                 @JsonProperty("fields") @Nullable List<String> fields,
                                 @JsonProperty("range") TimeRange timeRange,
                                 @JsonProperty("limit") int limit,
                                 @JsonProperty("offset") int offset,
                                 @JsonProperty("sorting") @Nullable Sorting sorting) {
        return builder()
                .query(query)
                .filter(filter)
                .fields(fields)
                .range(timeRange)
                .limit(limit > 0 ? limit : LIMIT)
                .offset(offset)
                .sorting(sorting)
                .build();
    }

    public static Builder builder() {
        return new AutoValue_SearchesConfig.Builder().limit(LIMIT);
    }

    @AutoValue.Builder
    public abstract static class Builder {
        public abstract Builder query(String query);

        public abstract Builder filter(String filter);

        public abstract Builder fields(List<String> fields);

        public abstract Builder range(TimeRange timeRange);

        public abstract Builder limit(int limit);

        public abstract Builder offset(int offset);

        public abstract Builder sorting(Sorting sorting);

        public abstract SearchesConfig build();
    }
}
