(function () {
  fetch('https://authelia.{{ DOMAIN }}/api/user/info', { credentials: 'include' })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var info = d.data;
      var name = info.display_name || info.username;
      var groups = (info.groups || []).join(', ');
      var toast = document.createElement('div');
      toast.id = '_auth_toast';
      toast.innerHTML =
        '<strong>' + name + '</strong>' +
        (info.display_name ? ' (' + info.username + ')' : '') +
        (groups ? '<br><small>' + groups + '</small>' : '');
      document.body.appendChild(toast);
      setTimeout(function () {
        toast.style.opacity = '0';
        setTimeout(function () { toast.remove(); }, 600);
      }, 5000);
    })
    .catch(function () {});
})();
