// ==UserScript==
// @name           Douban Sliding Navbar
// @namespace      http://npchen.blogspot.com
// @description    悬停式二级导航 + 自动显示邀请和提醒。
// @include        http://www.douban.com/*
// @exclude        http://www.douban.com/plaza/*
// @exclude        http://www.douban.com/service/apidoc/*
// @author         NullPointer
// @version        2.1.1
// ==/UserScript==

if(typeof unsafeWindow.jQuery !== "undefined") {
  var jQuery = unsafeWindow.jQuery;
  var $ = jQuery 
}

function CGM_getValue(v, utf8_defaultV) {
    var t = GM_getValue(v);
    if (t==undefined) return utf8_defaultV;
    else return decodeURIComponent(t);
}

function CGM_setValue(n, v) {
    GM_setValue(n, encodeURIComponent(v));
}



var home_bar = "<a href=\"/forum\">站务论坛</a><a href=\"http://blog.douban.com/\">豆瓣blog</a><a href=\"/help\">豆瓣指南</a><a href=\"/service\">豆瓣服务</a>"

var mydouban_bar = CGM_getValue("/mine/","<a href=\"/mine/notes\">日记</a><a href=\"/mine/discussions\">评论和讨论</a><a href=\"/mine/recs\">我的推荐</a><a href=\"/mine/miniblogs\">广播</a><a href=\"/mine/exchange\">二手</a><a href=\"/mine/doulists\">豆列</a><a href=\"/mine/board\">留言板</a>");

var neighbor_bar = CGM_getValue("/contacts/","<a href=\"/contacts/listfriends\">我的朋友</a><a href=\"/contacts/list\">我关注的人</a><a href=\"/contacts/find\">找朋友</a><a href=\"/contacts/invite\">邀请</a>");

var group_bar = CGM_getValue("/group/","<a href=\"/group/mine\">我的小组</a><a href=\"/group/my_topics\">我的发言</a><a href=\"/group/discover\">更多小组</a>");

var read_bar = CGM_getValue("/book/","读书: <a href=\"/book/mine\">我读</a><a href=\"/book/recommended\">豆瓣猜</a><a href=\"/book/review/best/\">热评</a><a href=\"/book/chart\">排行榜</a><a href=\"/book/browse\">分类浏览</a>");

var movie_bar = CGM_getValue("/movie/","电影: <a href=\"/movie/mine\">我看</a><a href=\"/movie/recommended\">豆瓣猜</a><a href=\"/movie/review/best/\">热评</a><a href=\"/movie/chart\">排行榜</a><a href=\"/movie/browse\">分类浏览</a><a href=\"/movie/tv\">电视剧</a>");

var music_bar = CGM_getValue("/music/","音乐: <a href=\"/music/mine\">我听</a><a href=\"/music/recommended\">豆瓣猜</a><a href=\"/music/review/best/\">热评</a><a href=\"/music/chart\">排行榜</a><a href=\"/music/browse\">分类浏览</a>");

var city_bar = CGM_getValue("/event/","<a href=\"/event/mine\">我的活动</a><a href=\"/event/\">我的城市</a><a href=\"/location/world/\">浏览其他城市</a>");

var now;
var sbar;

$(document).ready(function(){
  now = $("a.now").attr("href"); 
  var subnav =  $("div#subnav");
  sbar = subnav.html();
  var item = $("div#nav").children("a:first")
  item.mouseover(function(){subnav.html(home_bar)}); item = item.next();  
  item.mouseover(function(){subnav.html(mydouban_bar)}); item = item.next();
  item.mouseover(function(){subnav.html(neighbor_bar)}); item = item.next();
  item.mouseover(function(){subnav.html(group_bar)});  item = item.next();
  item.mouseover(function(){subnav.html(read_bar)});  item = item.next();
  item.mouseover(function(){subnav.html(movie_bar)});  item = item.next();
  item.mouseover(function(){subnav.html(music_bar)});  item = item.next();
  item.mouseover(function(){subnav.html(city_bar)});   item = item.next();
  item.mouseover(function(){subnav.html("")});
  $("div#main").mouseover(function(){subnav.html(sbar)});
//  $("h1").mouseover(function(){subnav.html(sbar)});
  
  var sta = $("#status a"); 
  var i = 0; 
  var staa = new Array(sta.length);
  $.each(sta, function(){staa[i++]=$(this).attr("href");});
  
  if ($.inArray("/doumail/", staa)!=-1) {
 
     $("<div id='peep'></div>").load("/notification/", function(){
      var checks = $("#peep #in_tablem ul:last p").length;
      $("#peep #in_tablem ul:last").remove();
      var uncheck = $("#peep #in_tablem ul p").length;
      var note = "提醒"; 
      checks = checks + uncheck;
      if (checks>0) note = note +"("+ uncheck +":"+checks+")";
      $("#status #subnav").after($("<a href='/notification'>"+note+"</a>"));
      $("#searbar span.submit a.butt:first").empty();
      $("body").remove("div#peep");
    }).appendTo("body").hide();
    
  $("<div id='peepy'></div>").load("/request/",function(){
      var reqs = $("#peepy #in_tablem li.mbtrdot").length;
      var req = "邀请";
      if (reqs>0) req = req + "("+reqs +")";
      $("#status #subnav").after($("<a href='/request'>"+req+"</a>"));
      $("#searbar span.submit a.butt:first").empty(); 
      $("body").remove("div#peepy");
     }).appendTo("body").hide();

    }
})

CGM_setValue(now, sbar);
