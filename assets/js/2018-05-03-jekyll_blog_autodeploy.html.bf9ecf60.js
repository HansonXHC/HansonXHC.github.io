"use strict";(self.webpackChunklearn_data=self.webpackChunklearn_data||[]).push([[8365],{3671:(n,e)=>{e.A=(n,e)=>{const s=n.__vccOpts||n;for(const[n,a]of e)s[n]=a;return s}},9402:(n,e,s)=>{s.r(e),s.d(e,{comp:()=>x,data:()=>C});var a=s(7847);const t=(0,a.Fv)('<p>Github 上搭建 Jekyll 是最方便的，空间免费、流量免费、部署简单。但 Github 属于被墙状态，将博客部署在那，速度实在太慢。在玩了几天后，我开始在服务器上直接搭建 Jekyll 博客。</p><p>服务器搭建需要人工执行 <code>jekyll build</code>, 完全背离了最开始搭建博客的初衷-<strong>方便</strong>。之后结合了网络上多个自动化方案，选定入门成本最低的 <code>Github</code> -&gt; <code>Travis CI</code> -&gt; <code>Docker</code>-&gt; <code>VPS</code>。</p><h2 id="搭建思路" tabindex="-1"><a class="header-anchor" href="#搭建思路"><span>搭建思路</span></a></h2><ul><li>本地提交博客 Markdown 文件 到 Github 源文件 repository</li><li>Github 触发 Travis CI 执行自动编译</li><li>Travis CI 编译后 push 静态文件到 Github 静态文件 repository</li><li>Travis CI 通知 Docker 重建镜像（预计 5 分钟）</li><li>服务器休眠 5 分钟后，Travis CI 通知服务器</li><li>服务器拉取最新镜像，然后停止并删除原容器，用最新镜像重建容器</li></ul><h2 id="travis-ci-基本配置" tabindex="-1"><a class="header-anchor" href="#travis-ci-基本配置"><span>Travis CI 基本配置</span></a></h2><p>Travis CI 对于开源项目完全免费，并且能自动感知到 Github 的 commit，帮我们解决了静态文件生成问题。</p><p>先用 Github 登录 Travis CI，然后点击最右侧的头像，开启想要使用 Travis CI 的项目</p><figure><img src="https://img.newzone.top/20180504135244.png?imageMogr2/format/webp" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>点击设置按钮，进入项目设置</p><figure><img src="https://img.newzone.top/20180504135541.png?imageMogr2/format/webp" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="静态文件更新" tabindex="-1"><a class="header-anchor" href="#静态文件更新"><span>静态文件更新</span></a></h2><p>Travis CI push 静态文件到 Github 通过 Github 的 token 实现授权，push 代码如下</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>after_success:\n  - <span class="token function">git</span> clone https://github.com/rockbenben/rockbenben.github.io.git\n  - <span class="token builtin class-name">cd</span> rockbenben.github.io <span class="token operator">&amp;&amp;</span> <span class="token function">rm</span> <span class="token parameter variable">-rf</span> * <span class="token operator">&amp;&amp;</span> <span class="token function">cp</span> <span class="token parameter variable">-r</span> <span class="token punctuation">..</span>/_site/* <span class="token builtin class-name">.</span>\n  - <span class="token function">git</span> config user.name <span class="token string">&quot;rockbenben&quot;</span>\n  - <span class="token function">git</span> config user.email <span class="token string">&quot;qingwhat@gmail.com&quot;</span>\n  - <span class="token function">git</span> <span class="token function">add</span> <span class="token parameter variable">--all</span> <span class="token builtin class-name">.</span>\n  - <span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&quot;Travis CI Auto Builder&quot;</span>\n  - <span class="token function">git</span> push <span class="token parameter variable">--force</span> https://<span class="token variable">$DEPLOY_TOKEN</span>@github.com/rockbenben/blog.git master\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>$DEPLOY_TOKEN</code> 是从 Github 授权得到的，「setting」&gt;「Developer settings」&gt;「Personal access tokens」&gt;「Generate new token」, 然后给于相应权限即可，<code>admin:public_key, admin:repo_hook, repo</code>。</p><figure><img src="https://img.newzone.top/20180504153729.png?imageMogr2/format/webp" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>进入 Travis 的 repo 项目，「More options」&gt;「Settings」&gt;「Environment Variables」, 新建一个变量<code>DEPLOY_TOKEN</code>，把 Github 的授权 token 保存在里面。</p><figure><img src="https://img.newzone.top/20180504154229.png?imageMogr2/format/webp" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>',17),i={href:"https://docs.travis-ci.com/user/encrypting-files/",target:"_blank",rel:"noopener noreferrer"},l=(0,a.Fv)('<h2 id="dockerfiles-设置" tabindex="-1"><a class="header-anchor" href="#dockerfiles-设置"><span>Dockerfiles 设置</span></a></h2><p>在 Github 中新建一个 repository，可以命名为 <code>dockerfiles</code>, 专门用来存储 Docker 镜像的设置文件。在 <code>dockerfiles</code> 新建文件夹 <code>jekyll</code> ，并在 <code>jekyll</code> 中新建文件 <code>Dockerfile</code>, 放入以下代码：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>FROM nginx:1.13.9-alpine\n\nLABEL <span class="token assign-left variable">maintainer</span><span class="token operator">=</span><span class="token string">&quot;Benson &lt;qingwhat@gmail.com&gt;&quot;</span>\n\nARG <span class="token assign-left variable">TZ</span><span class="token operator">=</span><span class="token string">&#39;Asia/Shanghai&#39;</span>\n\nENV TZ <span class="token variable">${TZ}</span>\n\nRUN apk upgrade <span class="token parameter variable">--update</span> <span class="token punctuation">\\</span>\n    <span class="token operator">&amp;&amp;</span> apk <span class="token function">add</span> <span class="token function">bash</span> <span class="token function">git</span> <span class="token punctuation">\\</span>\n    <span class="token operator">&amp;&amp;</span> <span class="token function">rm</span> <span class="token parameter variable">-rf</span> /usr/share/nginx/html <span class="token punctuation">\\</span>\n    <span class="token operator">&amp;&amp;</span> <span class="token function">git</span> clone https://github.com/rockbenben/blog.git /usr/share/nginx/html <span class="token punctuation">\\</span>\n    <span class="token operator">&amp;&amp;</span> <span class="token function">ln</span> <span class="token parameter variable">-sf</span> /usr/share/zoneinfo/<span class="token variable">${TZ}</span> /etc/localtime <span class="token punctuation">\\</span>\n    <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">echo</span> <span class="token variable">${TZ}</span> <span class="token operator">&gt;</span> /etc/timezone <span class="token punctuation">\\</span>\n    <span class="token operator">&amp;&amp;</span> <span class="token function">rm</span> <span class="token parameter variable">-rf</span> /var/cache/apk/*\n\n<span class="token comment"># ADD entrypoint.sh /entrypoint.sh #容易报错</span>\n<span class="token comment"># ADD flush /usr/local/bin/flush #容易报错</span>\n\nWORKDIR /usr/share/nginx/html\n\n<span class="token comment"># CMD [&quot;/entrypoint.sh&quot;] #容易报错</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>将 Travis CI 生成的静态文件推送到 Github，博客的 docker 化部署，采用 nginx + 静态文件 方式</p>',4),o={href:"https://github.com/mritd/dockerfile/tree/master/mritd",target:"_blank",rel:"noopener noreferrer"},r=(0,a.Lk)("h2",{id:"docker-镜像设置",tabindex:"-1"},[(0,a.Lk)("a",{class:"header-anchor",href:"#docker-镜像设置"},[(0,a.Lk)("span",null,"Docker 镜像设置")])],-1),p={href:"https://hub.docker.com",target:"_blank",rel:"noopener noreferrer"},c=(0,a.Lk)("code",null,"dockerfiles",-1),d=(0,a.Fv)('<p>建立 Automated Build 镜像后，进入 <code>Build Seeting</code>, 点击 Trigger，建立第一个 Docker 镜像。</p><figure><img src="https://img.newzone.top/20180504161016.png?imageMogr2/format/webp" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>然后在「Building Settings」&gt;「Build Triggers」&gt;「Activate Triggers」，复制 Trigger URL。</p><figure><img src="https://img.newzone.top/20180504161245.png?imageMogr2/format/webp" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>然后在服务器上执行下列代码，拉取并<strong>启动 Docker 镜像</strong>。</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">docker</span> pull rockben/jekyll\n<span class="token function">docker</span> stop jekyll_blog\n<span class="token function">docker</span> <span class="token function">rm</span> jekyll_blog\n<span class="token function">docker</span> run <span class="token parameter variable">--name</span><span class="token operator">=</span>jekyll_blog <span class="token parameter variable">-d</span> <span class="token parameter variable">-p</span> <span class="token number">39100</span>:80 <span class="token parameter variable">--privileged</span><span class="token operator">=</span>true rockben/jekyll:latest\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>--name=jekyll_blog 中的 <code>jekyll_blog</code> 是对容器的命名，方便后续操作。</p><p>-d 让容器在后台运行。</p><p>-p 映射端口：80 是容器内对应的端口，39100 是主机端口，也就是最终用户访问的端口，本端口可以自由选择。</p><p>--privileged=true 关闭安全权限，否则你容器操作文件夹没有权限。</p><p>--<code>rockben/jekyll:latest</code> 是容器名称，可省略 <code>:latest</code>。</p><p>运行容器后，访问 <code>seoipo.com:39100</code> 就可以看到镜像网页。如果每次用端口访问，可以在域名 DNS 中设置显性 URL，将二级域名 <code>blog.seoipo.com</code> 指向 <code>seoipo.com:39100</code></p><h3 id="docker-扩展阅读" tabindex="-1"><a class="header-anchor" href="#docker-扩展阅读"><span>Docker 扩展阅读</span></a></h3><p><strong>Docker 命令符</strong>：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">docker</span> <span class="token function">ps</span> // 查看所有正在运行容器\n<span class="token function">docker</span> stop containerId // containerId 是容器的 ID\n\n<span class="token function">docker</span> <span class="token function">ps</span> <span class="token parameter variable">-a</span> // 查看所有容器\n<span class="token function">docker</span> <span class="token function">ps</span> <span class="token parameter variable">-a</span> <span class="token parameter variable">-q</span> // 查看所有容器 ID\n\n<span class="token function">docker</span> stop <span class="token variable"><span class="token variable">$(</span><span class="token function">docker</span> <span class="token function">ps</span> <span class="token parameter variable">-a</span> <span class="token parameter variable">-q</span><span class="token variable">)</span></span> //  stop 停止所有容器\n<span class="token function">docker</span> <span class="token function">rm</span> <span class="token variable"><span class="token variable">$(</span><span class="token function">docker</span> <span class="token function">ps</span> <span class="token parameter variable">-a</span> <span class="token parameter variable">-q</span><span class="token variable">)</span></span> //   remove 删除所有容器\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong><code>docker run</code> 进阶设置</strong></p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">docker</span> run <span class="token parameter variable">--name</span><span class="token operator">=</span>jekyll_blog <span class="token parameter variable">-d</span> <span class="token parameter variable">-p</span> <span class="token number">39100</span>:80 <span class="token parameter variable">-v</span> /www/wwwroot/jekyll:/jekyll <span class="token parameter variable">--privileged</span><span class="token operator">=</span>true rockben/jekyll:latest /bin/bash\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>-v 挂载目录/root/software 本地目录 /software 容器目录，在创建前容器是没有 software 目录的，docker 容器会自己创建 --<code>/bin/bash</code> 这是 CMD 命令行，可不填</p><h2 id="ssh-免密码登录" tabindex="-1"><a class="header-anchor" href="#ssh-免密码登录"><span>SSH 免密码登录</span></a></h2><p>Travis 不能利用用户名和密码登陆，我们只有利用<strong>SSH 免密登陆</strong>服务器，更新并重启 Docker 容器。</p><p><strong>1、生成公钥/私钥对</strong></p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> ~/.ssh  <span class="token comment"># 切换 .ssh 目录，目录的第一个字符如果是 `.` 表示改文件夹是隐藏文件夹</span>\n<span class="token function">mkdir</span> ~/.ssh  <span class="token comment">#如果 .ssh 文件夹不存在，可以执行指令自行创建。如果 .ssh 文件已经存在，该命令会指出 .ssh 目录：/root/.ssh</span>\nssh-keygen <span class="token parameter variable">-t</span> rsa     <span class="token comment"># 生成 RSA 密钥对，后面所有的直接以默认就行，passphase 一定要为空</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>2、将生成的公钥添加为受信列表</strong></p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> ~/.ssh  <span class="token comment"># 切换.ssh 目录</span>\n<span class="token function">cat</span> id_rsa.pub <span class="token operator">&gt;&gt;</span> authorized_keys <span class="token comment">#将公钥内容输出到 authorized_keys 中</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>3、在.ssh 目录下新增配置文件 config</strong></p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> ~/.ssh  <span class="token comment"># 切换 .ssh 目录</span>\n<span class="token function">vim</span> config  <span class="token comment">#新建并打开目录</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>点击 <code>i</code> 进入编辑状态，输入下列代码。完毕后，点击 <code>Esc</code> 退出编辑状况，然后输入 <code>:wq!</code> 强制保存后离开文件</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>Host <span class="token builtin class-name">test</span>\nHostName <span class="token number">99.99</span>.99.99<span class="token punctuation">(</span>你的服务器 <span class="token function">ip</span><span class="token punctuation">)</span>\n<span class="token comment">#登陆的用户名</span>\nUser travis\nIdentitiesOnly <span class="token function">yes</span>\n<span class="token comment">#登陆使用的密钥</span>\nIdentityFile ~/.ssh/id_rsa\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>4、在 Linux 服务器安装 Travis 客户端</strong>（rvm -&gt; ruby -&gt; gem -&gt;Travis）</p><p><code>gem install travis</code></p><p><strong>5、服务器创建空白<code>.travis.yml</code>文件</strong></p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> /home/travis <span class="token comment">#新建 travis 文件夹</span>\n<span class="token function">touch</span> /home/travis/.travis.yml <span class="token comment">#在 travis 文件夹里创建空白 .travis.yml 文件</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>6、服务器登录 Travis，添加加密的私钥至代码仓库</strong></p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code><span class="token builtin class-name">cd</span> /home/travis  <span class="token comment">#进入 .travis.yml 所在文件夹</span>\ntravis login     <span class="token comment">#用 GitHub 账户登陆 travis</span>\n\n<span class="token comment">#登陆成功后解密私钥，--add 参数会把加密的私钥解密命令插入到.travis.yml，Travis 解密时要用到的</span>\n<span class="token comment">#-r 之后是 Github 源文件目录</span>\ntravis encrypt-file ~/.ssh/id_rsa <span class="token parameter variable">--add</span> <span class="token parameter variable">-r</span> rockbenben/rockbenben.github.io\n\n<span class="token comment">#保存加密后的私钥 id_rsa.enc，上传到 Github 源文件 repository 中</span>\n\n<span class="token comment">#.travis.yml 中也自动添加了解密命令</span>\n<span class="token function">cat</span> /home/travis/.travis.yml  <span class="token comment">#打开服务器的 .travis.yml 文件并保存</span>\nbefore_install:\n- openssl aes-256-cbc <span class="token parameter variable">-K</span> <span class="token variable">$encrypted_</span>****_key <span class="token parameter variable">-iv</span> <span class="token variable">$encrypted_</span>****_iv\n  <span class="token parameter variable">-in</span> id_rsa.enc <span class="token parameter variable">-out</span> ~/.ssh/id_rsa <span class="token parameter variable">-d</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>成功加密后，会提示</strong></p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>Make sure to <span class="token function">add</span> id_rsa.enc to the <span class="token function">git</span> repository.\nMake sure not to <span class="token function">add</span> ~/.ssh/id_rsa to the <span class="token function">git</span> repository.\nCommit all changes to your .travis.yml.\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p><strong>将新生成的 <code>id_rsa.enc</code> 文件上传到 Github 源文件 repository 中</strong></p></li><li><p>将 <code>.travis.yml</code> 中的 <code>openssl aes-256-cbc -K $encrypted_5c280379e96c_key -iv $encrypted_5c280379e96c_iv -in id_rsa.enc -out ~/.ssh/id_rsa -d</code> 放入最终的 <code>.travis.yml</code> 文件中。</p><figure><img src="https://img.newzone.top/20180504184508.png?imageMogr2/format/webp" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure></li></ul><h2 id="travis-yml-配置" tabindex="-1"><a class="header-anchor" href="#travis-yml-配置"><span>travis.yml 配置</span></a></h2><p>当项目内存在 <code>.travis.yml</code> 文件时，Travis CI 会按照其定义完成自动 build 过程，所以开启了上述配置以后还要在 Github 的 Jekyll 源文件项目下创建 <code>.travis.yml</code> 配置文件。</p><figure><img src="https://img.newzone.top/20180504141827.png?imageMogr2/format/webp" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><code>.travis.yml</code> 配置文件内容样例如下：</p><div class="language-bash line-numbers-mode" data-ext="sh" data-title="sh"><pre class="language-bash"><code>language: ruby\nrvm:\n- <span class="token number">2.3</span>.3\n\nbefore_script:\n- openssl aes-256-cbc <span class="token parameter variable">-K</span> <span class="token variable">$encrypted_5c280379e96c_key</span> <span class="token parameter variable">-iv</span> <span class="token variable">$encrypted_5c280379e96c_iv</span>\n  <span class="token parameter variable">-in</span> id_rsa.enc <span class="token parameter variable">-out</span> ~/.ssh/id_rsa <span class="token parameter variable">-d</span>      <span class="token comment">#本句是服务器上的 Travis 自动生成的，但默认生成的命令可能会在/前面带转义符\\，我们不需要这些转义符，手动删掉所有的转义符，否则可能在后面引发莫名的错误。</span>\n- <span class="token function">chmod</span> <span class="token number">600</span> ~/.ssh/id_rsa\n- <span class="token builtin class-name">echo</span> <span class="token parameter variable">-e</span> <span class="token string">&quot;Host 106.15.190.249<span class="token entity" title="\\n">\\n</span><span class="token entity" title="\\t">\\t</span>StrictHostKeyChecking no<span class="token entity" title="\\n">\\n</span>&quot;</span> <span class="token operator">&gt;&gt;</span> ~/.ssh/config <span class="token comment">#106.15.190.249 是服务器 IP，修改成你自己的就行</span>\n\n<span class="token comment"># Assume bundler is being used, therefore</span>\n<span class="token comment"># the `install` step will run `bundle install` by default.</span>\ninstall:\n- gem <span class="token function">install</span> jekyll\n- gem <span class="token function">install</span> jekyll-paginate\n\nscript: jekyll build <span class="token comment">#&amp;&amp; htmlproofer ./_site #指定目录容易报错</span>\n\nafter_success:\n  - <span class="token function">git</span> clone https://github.com/rockbenben/rockbenben.github.io.git\n  - <span class="token builtin class-name">cd</span> rockbenben.github.io <span class="token operator">&amp;&amp;</span> <span class="token function">rm</span> <span class="token parameter variable">-rf</span> * <span class="token operator">&amp;&amp;</span> <span class="token function">cp</span> <span class="token parameter variable">-r</span> <span class="token punctuation">..</span>/_site/* <span class="token builtin class-name">.</span>\n  - <span class="token function">git</span> config user.name <span class="token string">&quot;rockbenben&quot;</span>\n  - <span class="token function">git</span> config user.email <span class="token string">&quot;qingwhat@gmail.com&quot;</span>\n  - <span class="token function">git</span> <span class="token function">add</span> <span class="token parameter variable">--all</span> <span class="token builtin class-name">.</span>\n  - <span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&quot;Travis CI Auto Builder&quot;</span>\n  - <span class="token function">git</span> push <span class="token parameter variable">--force</span> https://<span class="token variable">$DEPLOY_TOKEN</span>@github.com/rockbenben/blog.git master\n  <span class="token comment"># Trigger all tags/branchs for this automated build.</span>\n  - <span class="token function">curl</span> <span class="token parameter variable">-X</span> POST https://registry.hub.docker.com/u/rockben/jekyll/trigger/9b1e9527-0cf1-4756-8332-50f8dff37747/ <span class="token comment">#本句的链接是 hub.docker.com 自动生成，进入 docker 项目后，Building Settings - Build Triggers - Activate Triggers ，复制 Trigger URL</span>\n  - <span class="token function">sleep</span> 5m <span class="token comment">#超过 10 分钟，tavis 将失去响应。此处是在等待 docker 镜像更新</span>\n  - <span class="token function">ssh</span> root@106.15.190.249 <span class="token parameter variable">-p</span> <span class="token number">27378</span> <span class="token parameter variable">-o</span> <span class="token assign-left variable">StrictHostKeyChecking</span><span class="token operator">=</span>no <span class="token string">&quot;docker pull rockben/jekyll &amp;&amp; docker stop jekyll_blog &amp;&amp; docker rm jekyll_blog &amp;&amp; docker run --name=jekyll_blog -d -p 39100:80 --privileged=true rockben/jekyll:latest&quot;</span>  <span class="token comment">#ssh 连接后，重启 docker 容器，jekyll_blog 为之前设定的容器名。</span>\n  <span class="token comment"># -p 27378 是我自设的服务器端口，默认是 22</span>\n  <span class="token comment"># - ssh root@106.15.190.249 -p 27378 -o StrictHostKeyChecking=no &quot;/www/wwwroot/jekyll_build.sh&quot; #执行 jekyll 重建脚本</span>\n  <span class="token comment">#- ssh root@106.15.190.249 -o StrictHostKeyChecking=no &#39;cd ~/blog-front &amp;&amp; git pull &amp;&amp; npm install &amp;&amp; npm run build&#39;   #使用 ssh 连接服务器，git pull?</span>\n\n<span class="token comment"># branch whitelist, only for Github Pages</span>\nbranchs:\n  only:\n  - master  <span class="token comment">#指定只有检测到 master 分支有变动时才执行任务</span>\n\nenv:\n  global:\n  - <span class="token assign-left variable">NOKOGIRI_USE_SYSTEM_LIBRARIES</span><span class="token operator">=</span>true <span class="token comment"># speeds up installation of html-proofer</span>\n\naddons:\n  ssh_known_hosts:\n  - <span class="token number">106.15</span>.190.249 <span class="token comment">#受信主机，你的 Linux 服务器 ip</span>\n\nsudo: <span class="token boolean">false</span> <span class="token comment"># route your build to the container-based infrastructure for a faster build</span>\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>',42),m={href:"https://docs.travis-ci.com/",target:"_blank",rel:"noopener noreferrer"},u=(0,a.Lk)("p",null,"参考资料&引用：",-1),b={href:"https://github.com/Huxpro/huxpro.github.io",target:"_blank",rel:"noopener noreferrer"},v={href:"https://zhuanlan.zhihu.com/p/25066056",target:"_blank",rel:"noopener noreferrer"},k={href:"https://mritd.me/2017/02/25/jekyll-blog-+-travis-ci-auto-deploy/",target:"_blank",rel:"noopener noreferrer"},g={href:"https://juejin.im/post/5a9e1a5751882555712bd8e1",target:"_blank",rel:"noopener noreferrer"},h={href:"https://segmentfault.com/a/1190000011218410",target:"_blank",rel:"noopener noreferrer"},f={href:"https://juejin.im/post/5a2941ad6fb9a045030ffc95",target:"_blank",rel:"noopener noreferrer"},y={href:"http://www.cnblogs.com/scofi/p/6617394.html",target:"_blank",rel:"noopener noreferrer"},_={href:"https://blog.csdn.net/yinweitao12/article/details/73165914",target:"_blank",rel:"noopener noreferrer"},w={href:"http://www.cnblogs.com/YasinXiao/p/7736075.html",target:"_blank",rel:"noopener noreferrer"},L={href:"https://yeasy.gitbooks.io/docker_practice/",target:"_blank",rel:"noopener noreferrer"},T={},x=(0,s(3671).A)(T,[["render",function(n,e){const s=(0,a.g2)("ExternalLinkIcon");return(0,a.uX)(),(0,a.CE)("div",null,[t,(0,a.Lk)("p",null,[(0,a.eW)("Travis CI 提供了存放加密文件的方式，参考 "),(0,a.Lk)("a",i,[(0,a.eW)("官方文档"),(0,a.bF)(s)]),(0,a.eW)("。")]),l,(0,a.Lk)("p",null,[(0,a.eW)("样例 Dockerfile: "),(0,a.Lk)("a",o,[(0,a.eW)("https://github.com/mritd/dockerfile/tree/master/mritd"),(0,a.bF)(s)])]),r,(0,a.Lk)("p",null,[(0,a.eW)("注册并登录 "),(0,a.Lk)("a",p,[(0,a.eW)("Docker Hub"),(0,a.bF)(s)]),(0,a.eW)("，点击 「Create」>「Create Automated Build」>「Create Auto-build Github」, 选择之前新建的 "),c,(0,a.eW)(" repository。")]),d,(0,a.Lk)("p",null,[(0,a.eW)("具体 .travis.yml 配置，请参考 "),(0,a.Lk)("a",m,[(0,a.eW)("官方文档"),(0,a.bF)(s)]),(0,a.eW)("。")]),u,(0,a.Lk)("ul",null,[(0,a.Lk)("li",null,[(0,a.Lk)("p",null,[(0,a.Lk)("a",b,[(0,a.eW)("Jekyll 模板 hux blog"),(0,a.bF)(s)])])]),(0,a.Lk)("li",null,[(0,a.Lk)("p",null,[(0,a.Lk)("a",v,[(0,a.eW)("一点都不高大上，手把手教你使用 Travis CI 实现持续部署"),(0,a.bF)(s)])])]),(0,a.Lk)("li",null,[(0,a.Lk)("p",null,[(0,a.Lk)("a",k,[(0,a.eW)("Jekyll + Travis CI 自动化部署博客"),(0,a.bF)(s)])])]),(0,a.Lk)("li",null,[(0,a.Lk)("p",null,[(0,a.Lk)("a",g,[(0,a.eW)("Travis-CI 自动化测试并部署至自己的 CentOS 服务器"),(0,a.bF)(s)])])]),(0,a.Lk)("li",null,[(0,a.Lk)("p",null,[(0,a.Lk)("a",h,[(0,a.eW)("Travis CI 系列：自动化部署博客"),(0,a.bF)(s)])])]),(0,a.Lk)("li",null,[(0,a.Lk)("p",null,[(0,a.Lk)("a",f,[(0,a.eW)("SSH 免密登录远程服务器"),(0,a.bF)(s)])])]),(0,a.Lk)("li",null,[(0,a.Lk)("p",null,[(0,a.Lk)("a",y,[(0,a.eW)("SSH 公钥登录原理"),(0,a.bF)(s)])])]),(0,a.Lk)("li",null,[(0,a.Lk)("p",null,[(0,a.Lk)("a",_,[(0,a.eW)("如何将 dockerhub 与 github 关联"),(0,a.bF)(s)])])]),(0,a.Lk)("li",null,[(0,a.Lk)("p",null,[(0,a.Lk)("a",w,[(0,a.eW)("docker 启动，端口映射，挂载本地目录"),(0,a.bF)(s)])])]),(0,a.Lk)("li",null,[(0,a.Lk)("p",null,[(0,a.Lk)("a",L,[(0,a.eW)("Docker — 从入门到实践"),(0,a.bF)(s)])])])])])}]]),C=JSON.parse('{"path":"/posts/2018-05-03-jekyll_blog_autodeploy.html","title":"Jekyll 篇二：自动部署服务器博客","lang":"zh-CN","frontmatter":{"title":"Jekyll 篇二：自动部署服务器博客","date":"2018-05-03T00:00:00.000Z","category":["博客"],"tag":["Jekyll","Travis CI","Docker"],"order":-15,"description":"Github 上搭建 Jekyll 是最方便的，空间免费、流量免费、部署简单。但 Github 属于被墙状态，将博客部署在那，速度实在太慢。在玩了几天后，我开始在服务器上直接搭建 Jekyll 博客。 服务器搭建需要人工执行 jekyll build, 完全背离了最开始搭建博客的初衷-方便。之后结合了网络上多个自动化方案，选定入门成本最低的 Githu...","head":[["meta",{"property":"og:url","content":"https://newzone.top/posts/2018-05-03-jekyll_blog_autodeploy.html"}],["meta",{"property":"og:site_name","content":"LearnData-开源笔记"}],["meta",{"property":"og:title","content":"Jekyll 篇二：自动部署服务器博客"}],["meta",{"property":"og:description","content":"Github 上搭建 Jekyll 是最方便的，空间免费、流量免费、部署简单。但 Github 属于被墙状态，将博客部署在那，速度实在太慢。在玩了几天后，我开始在服务器上直接搭建 Jekyll 博客。 服务器搭建需要人工执行 jekyll build, 完全背离了最开始搭建博客的初衷-方便。之后结合了网络上多个自动化方案，选定入门成本最低的 Githu..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://img.newzone.top/20180504135244.png?imageMogr2/format/webp"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-02-26T17:51:54.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"Jekyll 篇二：自动部署服务器博客"}],["meta",{"property":"article:author","content":"清顺"}],["meta",{"property":"article:tag","content":"Jekyll"}],["meta",{"property":"article:tag","content":"Travis CI"}],["meta",{"property":"article:tag","content":"Docker"}],["meta",{"property":"article:published_time","content":"2018-05-03T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-02-26T17:51:54.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Jekyll 篇二：自动部署服务器博客\\",\\"image\\":[\\"https://img.newzone.top/20180504135244.png?imageMogr2/format/webp\\",\\"https://img.newzone.top/20180504135541.png?imageMogr2/format/webp\\",\\"https://img.newzone.top/20180504153729.png?imageMogr2/format/webp\\",\\"https://img.newzone.top/20180504154229.png?imageMogr2/format/webp\\",\\"https://img.newzone.top/20180504161016.png?imageMogr2/format/webp\\",\\"https://img.newzone.top/20180504161245.png?imageMogr2/format/webp\\",\\"https://img.newzone.top/20180504184508.png?imageMogr2/format/webp\\",\\"https://img.newzone.top/20180504141827.png?imageMogr2/format/webp\\"],\\"datePublished\\":\\"2018-05-03T00:00:00.000Z\\",\\"dateModified\\":\\"2024-02-26T17:51:54.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"清顺\\",\\"url\\":\\"https://newzone.top\\"}]}"]]},"headers":[{"level":2,"title":"搭建思路","slug":"搭建思路","link":"#搭建思路","children":[]},{"level":2,"title":"Travis CI 基本配置","slug":"travis-ci-基本配置","link":"#travis-ci-基本配置","children":[]},{"level":2,"title":"静态文件更新","slug":"静态文件更新","link":"#静态文件更新","children":[]},{"level":2,"title":"Dockerfiles 设置","slug":"dockerfiles-设置","link":"#dockerfiles-设置","children":[]},{"level":2,"title":"Docker 镜像设置","slug":"docker-镜像设置","link":"#docker-镜像设置","children":[{"level":3,"title":"Docker 扩展阅读","slug":"docker-扩展阅读","link":"#docker-扩展阅读","children":[]}]},{"level":2,"title":"SSH 免密码登录","slug":"ssh-免密码登录","link":"#ssh-免密码登录","children":[]},{"level":2,"title":"travis.yml 配置","slug":"travis-yml-配置","link":"#travis-yml-配置","children":[]}],"git":{"createdTime":1708969914000,"updatedTime":1708969914000,"contributors":[{"name":"HansonXHC","email":"107744279+HansonXHC@users.noreply.github.com","commits":1}]},"readingTime":{"minutes":7.68,"words":2303},"filePathRelative":"_posts/2018-05-03-jekyll_blog_autodeploy.md","localizedDate":"2018年5月3日","excerpt":"<p>Github 上搭建 Jekyll 是最方便的，空间免费、流量免费、部署简单。但 Github 属于被墙状态，将博客部署在那，速度实在太慢。在玩了几天后，我开始在服务器上直接搭建 Jekyll 博客。</p>\\n<p>服务器搭建需要人工执行 <code>jekyll build</code>, 完全背离了最开始搭建博客的初衷-<strong>方便</strong>。之后结合了网络上多个自动化方案，选定入门成本最低的 <code>Github</code> -&gt; <code>Travis CI</code> -&gt; <code>Docker</code>-&gt; <code>VPS</code>。</p>","autoDesc":true}')}}]);