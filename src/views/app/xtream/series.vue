<template>
  <erd-row class="m-0 p-0" id="streams">
    <erd-spinner v-if="isLoading" size="lg" overlay absolute></erd-spinner>
    <erd-col xl="12" sm="12" v-if="!editor">
      <b-table :items="paged" :fields="fields" striped small>
        <template v-slot:cell(movie_name)="row">
          {{
            row.item.movie_name.length
              ? row.item.movie_name
              : row.item.stream_tvg_name
          }}
        </template>
        <template v-slot:cell(tmdb_id)="row">
          <a
            :href="`https://www.themoviedb.org/tv/${row.item.tmdb_id}`"
            target="_blank"
            >{{ row.item.tmdb_id }}</a
          >
        </template>
        <template v-slot:cell(stream_is_hidden)="row">
          <erd-badge
            class="py-1 px-2"
            variant="danger"
            v-if="row.item.stream_is_hidden"
            >{{ $t("general.yes") }}</erd-badge
          >
          <erd-badge class="py-1 px-2" variant="success" v-else>{{
            $t("general.no")
          }}</erd-badge>
        </template>
        <template v-slot:cell(stream_tvg_logo)="row">
          <a
            :href="row.item.stream_tvg_logo"
            v-if="row.item.stream_tvg_logo"
            target="_blank"
          >
            <img class="serie-icon" :src="row.item.stream_tvg_logo"
          /></a>
        </template>
        <template v-slot:cell(actions)="row">
          <erd-tooltip :tooltip="$t('xtream.tooltip-edit-series')" :enabled="showTooltips">
            <erd-button
              variant="info"
              class="btn-table"
              @click="editStream(row.item)"
              ><i class="las la-pen"></i
            ></erd-button>
          </erd-tooltip>
          <erd-tooltip :tooltip="$t('xtream.tooltip-delete-series')" :enabled="showTooltips">
            <erd-button
              variant="danger"
              class="btn-table"
              @click="deleteStream(row.item.id)"
              ><i class="las la-trash"></i
            ></erd-button>
          </erd-tooltip>
        </template>
      </b-table>
      <b-pagination
        class="w-100 my-3"
        size="sm"
        align="center"
        :total-rows="total"
        :per-page="perPage"
        v-model="currentPage"
      >
        <template v-slot:next-text>
          <i class="las la-angle-right" />
        </template>
        <template v-slot:prev-text>
          <i class="las la-angle-left" />
        </template>
        <template v-slot:first-text>
          <i class="las la-angle-double-left" />
        </template>
        <template v-slot:last-text>
          <i class="las la-angle-double-right" />
        </template>
      </b-pagination>
    </erd-col>
    <!-- Stream -->
    <erd-col xl="12" sm="12" v-if="editor && activeTab === 0">
      <label class="d-block" for="playlist">{{ $t("xtream.playlist") }}</label>
      <erd-select
        id="playlist"
        ref="playlist"
        class="mt-1 mb-2 w-100"
        v-model="stream.playlist_id"
        :items="playlists"
      ></erd-select>
      <label class="d-block" for="group">{{ $t("xtream.group") }}</label>
      <erd-select
        id="group"
        ref="group"
        class="mt-1 mb-2 w-100"
        v-model="stream.group_id"
        :items="groups"
      ></erd-select>
      <label class="d-block" for="name">{{ $t("xtream.name") }}</label>
      <erd-input
        id="name"
        class="mt-1 mb-2 w-100"
        v-model="stream.stream_tvg_name"
      ></erd-input>
      <label class="d-block" for="tvg-logo">{{
        $t("xtream.stream-icon")
      }}</label>
      <erd-input
        id="tvg-logo"
        class="mt-1 mb-2 w-100"
        v-model="stream.stream_tvg_logo"
      ></erd-input>
      <label class="d-block" for="order">{{ $t("xtream.order") }}</label>
      <erd-input
        id="order"
        class="mt-1 mb-2 w-100"
        v-model="stream.stream_order"
        type="number"
      ></erd-input>
      <erd-checkbox
        class="mb-2 w-100"
        v-model="stream.stream_is_hidden"
        :true-value="1"
        :false-value="0"
        >{{ $t("xtream.hidden") }}</erd-checkbox
      >
    </erd-col>
    <!-- TMDB -->
    <erd-col xl="12" sm="12" v-if="editor && activeTab === 1">
      <label class="d-block" for="series-name">{{
        $t("xtream.series-name")
      }}</label>
      <erd-input
        id="series-name"
        class="mt-1 mb-2 w-100"
        v-model="stream.serie_name"
      ></erd-input>
      <label class="d-block" for="season">{{ $t("xtream.season") }}</label>
      <erd-input
        id="season"
        class="mt-1 mb-2 w-100"
        v-model="stream.serie_season"
      ></erd-input>
      <label class="d-block" for="episode">{{ $t("xtream.episode") }}</label>
      <erd-input
        id="episode"
        class="mt-1 mb-2 w-100"
        v-model="stream.serie_episode"
      ></erd-input>
      <label class="d-block" for="trailer">{{
        $t("xtream.youtube-trailer")
      }}</label>
      <erd-input
        id="trailer"
        class="mt-1 mb-2 w-100"
        v-model="stream.serie_trailer"
      ></erd-input>
      <label class="d-block" for="tmdb-id">{{ $t("xtream.tmdb-id") }}</label>
      <erd-input
        id="tmdb-id"
        class="mt-1 mb-2 w-100"
        v-model="stream.tmdb_id"
      ></erd-input>
      <label class="d-block" for="tmdb-id-episode">{{
        $t("xtream.tmdb-id-episode")
      }}</label>
      <erd-input
        id="tmdb-id-episode"
        class="mt-1 mb-2 w-100"
        v-model="stream.tmdb_episode_id"
      ></erd-input>
    </erd-col>
  </erd-row>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */
import { EventBus } from "../../../services/ebus";
import { httpService } from "../../../services/http";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      dateOptions: { day: "2-digit", month: "numeric", year: "numeric" },
      activeTab: 0,
      playlists: [],
      groups: [],
      streams: [],
      stream: null,
      editor: false,
      search: null,
      isLoading: false,
      from: 0,
      to: 0,
      total: 0,
      currentPage: 1,
      fields: [
        {
          key: "playlist",
          label: this.$t("xtream.playlist"),
          sortable: true,
        },
        { key: "group", label: this.$t("xtream.group"), sortable: true },
        {
          key: "serie_name",
          label: this.$t("xtream.name"),
          sortable: true,
        },
        {
          key: "serie_season",
          label: this.$t("xtream.season"),
          sortable: true,
        },
        {
          key: "serie_episode",
          label: this.$t("xtream.episode"),
          sortable: true,
        },
        {
          key: "stream_tvg_logo",
          label: this.$t("xtream.stream-icon"),
          sortable: true,
        },
        { key: "tmdb_id", label: this.$t("xtream.tmdb-id"), sortable: true },
        {
          key: "stream_is_hidden",
          label: this.$t("xtream.hidden"),
          sortable: true,
        },
        { key: "stream_order", label: this.$t("xtream.order"), sortable: true },
        {
          key: "actions",
          label: this.$t("users.actions"),
          sortable: false,
          thClass: "text-right",
          tdClass: "text-right",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["currentUser", "settings"]),
    showTooltips () {
      return this.settings.showTooltips;
    },
    perPage() {
      return this.settings.perPage;
    },
    searchFiltered() {
      if (this.search === null) {
        return this.streams;
      } else {
        var re = new RegExp(this.search, "i");
        return this.streams.filter((stream) => {
          return (
            String(stream.stream_tvg_name).match(re) ||
            String(stream.stream_tvg_logo).match(re) ||
            String(stream.serie_name).match(re) ||
            String(stream.serie_season).match(re) ||
            String(stream.serie_episode).match(re) ||
            String(stream.tmdb_id).match(re) ||
            String(stream.playlist).match(re) ||
            String(stream.group).match(re)
          );
        });
      }
    },
    paged() {
      this.total = this.searchFiltered.length;
      this.from = (this.currentPage - 1) * this.perPage;
      this.to =
        this.from + this.perPage > this.total
          ? this.total
          : this.from + this.perPage;
      return this.searchFiltered.slice(this.from, this.to);
    },
  },
  methods: {
    loadStreams() {
      let amount = 100;
      let streams = [];
      this.isLoading = true;
      Promise.all([
        httpService.get("series/total"),
        httpService.get("group/simple"),
        httpService.get("playlist/simple"),
      ])
        .then((res) => {
          if (res[0].status === true) {
            let requests = [];
            for (var i = 0; i < res[0].data / amount; i++) {
              requests.push(httpService.get(`series/${i * amount}/${amount}`));
            }
            Promise.all(requests).then((results) => {
              this.isLoading = false;
              results.map((res) => {
                if (res.status === true) {
                  streams = [...streams, ...res.data];
                }
              });
              this.streams = streams;
            });
          }
          if (res[1].status === true) {
            this.groups = res[1].data
              .filter((group) => {
                return group.group_type == 3;
              })
              .map((group) => {
                return {
                  text: group.group_name,
                  value: group.id,
                };
              });
          }
          if (res[2].status === true) {
            this.playlists = res[2].data.map((playlist) => {
              return {
                text: playlist.name,
                value: playlist.id,
              };
            });
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("xtream.series-load-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    addStream() {
      httpService
        .post("series/add")
        .then((res) => {
          this.isLoading = false;
          if (res.status === true && res.data) {
            this.stream = {
              id: res.data,
              playlist_id: 0,
              group_id: 0,
              stream_tvg_name: "",
              stream_tvg_id: "",
              stream_tvg_logo: "",
              stream_order: 0,
              stream_is_hidden: 0,
              serie_name: "",
              serie_season: 0,
              serie_episode: 0,
              serie_trailer: "",
              tmdb_id: "",
              tmdb_episode_id: "",
            };
            this.editor = true;
          }
        })
        .catch(() => {
          this.isLoading = false;
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("xtream.series-load-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    editStream(stream) {
      this.stream = Object.assign({}, stream);
      this.editor = true;
    },
    cancelEditor() {
      this.editor = false;
    },
    saveEditor() {
      let stream = Object.assign({}, this.stream);
      delete stream.id;
      delete stream.playlist;
      delete stream.group;

      httpService
        .put(`series/${this.stream.id}`, stream)
        .then((res) => {
          if (res.status === true) {
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("xtream.series-save-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
            this.editor = false;
            this.loadStreams();
          }
        })
        .catch(() => {
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("xtream.series-save-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    deleteStream(id) {
      httpService
        .delete(`series/${id}`)
        .then((res) => {
          if (res.status === true) {
            this.$notify(
              "primary",
              this.$t("profile.success"),
              this.$t("xtream.series-delete-success"),
              "la-user-shield",
              { duration: 5000, permanent: false }
            );
            this.loadStreams();
          }
        })
        .catch(() => {
          this.$notify(
            "error",
            this.$t("profile.failed"),
            this.$t("xtream.series-delete-error"),
            "la-user-shield",
            { duration: 5000, permanent: false }
          );
        });
    },
    searchStream(search) {
      if (search.length === 0) {
        this.search = null;
      } else {
        this.search = search;
      }
    },
    printStreams() {
      document.getElementById("streams").print();
    },
    formatDate(date) {
      return new Date(date).toLocaleString(
        this.$t("date.locale"),
        this.dateOptions
      );
    },
    doTabChange(tab) {
      this.activeTab = tab;
    },
  },
  beforeMount() {
    this.loadStreams();
    EventBus.$on("search", this.searchStream);
    EventBus.$on("print", this.printStreams);
    EventBus.$on("refresh", this.loadStreams);
    EventBus.$on("add", this.addStream);
    EventBus.$on("cancel", this.cancelEditor);
    EventBus.$on("save", this.saveEditor);
    EventBus.$on("tab-change", this.doTabChange);
  },
  beforeDestroy() {
    EventBus.$off("search", this.searchStream);
    EventBus.$off("print", this.printStreams);
    EventBus.$off("refresh", this.loadStreams);
    EventBus.$off("add", this.addStream);
    EventBus.$off("cancel", this.cancelEditor);
    EventBus.$off("save", this.saveEditor);
    EventBus.$off("tab-change", this.doTabChange);
  },
  watch: {
    from: function (val) {
      EventBus.$emit("update-from", val);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },
    to: function (val) {
      EventBus.$emit("update-to", val);
    },
    total: function (val) {
      EventBus.$emit("update-total", val);
    },
    editor: function (val) {
      EventBus.$emit("update-editor", val);
    },
  },
};
</script>

<style lang="scss">
.modal-groups {
  max-height: 250px;
  overflow: hidden;

  .ps {
    max-height: 250px;
  }
}
.serie-icon {
  max-height: 100px;
}
</style>
