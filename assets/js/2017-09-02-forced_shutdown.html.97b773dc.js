"use strict";(self.webpackChunklearn_data=self.webpackChunklearn_data||[]).push([[5478],{3671:(e,t)=>{t.A=(e,t)=>{const a=e.__vccOpts||e;for(const[e,o]of t)a[e]=o;return a}},5472:(e,t,a)=>{a.r(t),a.d(t,{comp:()=>s,data:()=>l});var o=a(7847);const n=[(0,o.Fv)('<p>晚上明明按下电脑的关机键，第二天早上却发现电脑开了一晚上？这是因为后台和 GUI 应用程序在阻止或取消关机，使得系统无法正常关机。为解决此问题，可以按照以下方法授予系统自动关机权限。</p><h2 id="手工操作" tabindex="-1"><a class="header-anchor" href="#手工操作"><span>手工操作</span></a></h2><ol><li><p>点击「开始菜单」，搜索「Regedit」，进入注册表编辑器。</p></li><li><p>打开窗口后，向注册表上方菜单输入路径 <code>计算机\\HKEY_CURRENT_USER\\Control Panel\\Desktop</code>。</p></li><li><p>在右侧窗格中找到 <code>AutoEndTasks</code> 键值。若不存在，则新建一个名为 <code>AutoEndTasks</code> 的「字符串值」，并将键值的数值设为 <code>1</code>。AutoEndTasks 表示自动结束失去响应的程序任务。<code>0</code> 表示 false（默认值），而 <code>1</code> 表示 true，电脑会自动结束失去响应的程序。</p><figure><img src="https://pic3.zhimg.com/v2-c643b9737b35f9dd9a8382c5653e3d3e_r.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure></li><li><p>查找或创建 <code>WaitToKillAppTimeout</code> 字符串值，并设定其数值为 2000。2000 以毫秒计，表示在程序失去响应后，系统将等待 2 秒后自动结束相应程序。</p></li></ol><p>按照以上步骤操作，即可设置电脑默认为强制关机。</p><h2 id="通过脚本修改" tabindex="-1"><a class="header-anchor" href="#通过脚本修改"><span>通过脚本修改</span></a></h2><p>如果你不愿手动修改注册表，可以选择以下三种脚本之一进行操作。</p><h3 id="注册表脚本修改" tabindex="-1"><a class="header-anchor" href="#注册表脚本修改"><span>注册表脚本修改</span></a></h3><p>复制下列命令并粘贴至文本编辑器（如记事本）中，保存文件，扩展名为 <code>.reg</code>，如 settings.reg。双击该文件即可将修改应用到注册表中。（脚本由 @daxixi 提供）</p><div class="language-reg line-numbers-mode" data-ext="reg" data-title="reg"><pre class="language-reg"><code>Windows Registry Editor Version 5.00\n\n[HKEY_CURRENT_USER\\Control Panel\\Desktop]\n&quot;AutoEndTasks&quot;=&quot;1&quot;\n&quot;WaitToKillAppTimeout&quot;=&quot;2000&quot;\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="cmd-修改" tabindex="-1"><a class="header-anchor" href="#cmd-修改"><span>cmd 修改</span></a></h3><p>以管理员权限运行 cmd（命令提示符），输入以下命令：</p><div class="language-cmd line-numbers-mode" data-ext="cmd" data-title="cmd"><pre class="language-cmd"><code>reg add &quot;HKEY_CURRENT_USER\\Control Panel\\Desktop&quot; /v AutoEndTasks /t REG_SZ /d 1 /f\n\nreg add &quot;HKEY_CURRENT_USER\\Control Panel\\Desktop&quot; /v WaitToKillAppTimeout /t REG_SZ /d 2000 /f\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="powershell-修改" tabindex="-1"><a class="header-anchor" href="#powershell-修改"><span>PowerShell 修改</span></a></h3><p>以管理员权限运行 PowerShell，输入以下命令：</p><div class="language-powershell line-numbers-mode" data-ext="powershell" data-title="powershell"><pre class="language-powershell"><code>cmd <span class="token operator">/</span>c reg add <span class="token string">&quot;HKEY_CURRENT_USER\\Control Panel\\Desktop&quot;</span> <span class="token operator">/</span>v AutoEndTasks <span class="token operator">/</span>t REG_SZ <span class="token operator">/</span>d 1 <span class="token operator">/</span>f\n\ncmd <span class="token operator">/</span>c reg add <span class="token string">&quot;HKEY_CURRENT_USER\\Control Panel\\Desktop&quot;</span> <span class="token operator">/</span>v WaitToKillAppTimeout <span class="token operator">/</span>t REG_SZ <span class="token operator">/</span>d 2000 <span class="token operator">/</span>f\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>——————————</p><p>网上流行一种通过修改「gpedit.msc」达到快速关机的方法，但实际测试结果表明，这种方法并<strong>不能实现强制关机</strong>。以下为这种方法的操作流程记录，仅供参考：</p><ol><li><p>点击桌面左下角“windows”图标，选择“运行”选项；</p></li><li><p>进入运行窗口，输入“gpedit.msc”命令，按下回车键确定；</p></li><li><p>打开本地组策略编辑器界面，依次展开“计算机配置——管理模板——系统——关机选项”文件夹；鼠标右击右侧“关闭会阻止或取消关机的应用程序的自动终止功能”选项，接着选择“编辑”功能；将弹出窗口选项更改成“已启用”，然后点击“应用——确定”按钮。</p><figure><img src="https://pic4.zhimg.com/v2-4b736585b25509b036935a2f9c37d843_r.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>但开启后，提示程序没有响应，无法关机。</p><figure><img src="https://pic4.zhimg.com/v2-46fafee0cb6e212e793fc80268ab0917_r.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure></li></ol><p>修改“gpedit.msc”虽然可以撤销程序阻止关机的权限，但它并没有赋予关机进程对程序的关闭权限，因此并不能达到强制关机的效果。</p>',19)],i={},s=(0,a(3671).A)(i,[["render",function(e,t){return(0,o.uX)(),(0,o.CE)("div",null,n)}]]),l=JSON.parse('{"path":"/posts/2017-09-02-forced_shutdown.html","title":"电脑关机了，第二天一看确又开着的？让系统正常关机！","lang":"zh-CN","frontmatter":{"title":"电脑关机了，第二天一看确又开着的？让系统正常关机！","date":"2017-09-02T00:38:00.000Z","category":["系统"],"tag":["关机"],"order":-5,"description":"晚上明明按下电脑的关机键，第二天早上却发现电脑开了一晚上？这是因为后台和 GUI 应用程序在阻止或取消关机，使得系统无法正常关机。为解决此问题，可以按照以下方法授予系统自动关机权限。 手工操作 点击「开始菜单」，搜索「Regedit」，进入注册表编辑器。 打开窗口后，向注册表上方菜单输入路径 计算机\\\\HKEY_CURRENT_USER\\\\Control ...","head":[["meta",{"property":"og:url","content":"https://newzone.top/posts/2017-09-02-forced_shutdown.html"}],["meta",{"property":"og:site_name","content":"LearnData-开源笔记"}],["meta",{"property":"og:title","content":"电脑关机了，第二天一看确又开着的？让系统正常关机！"}],["meta",{"property":"og:description","content":"晚上明明按下电脑的关机键，第二天早上却发现电脑开了一晚上？这是因为后台和 GUI 应用程序在阻止或取消关机，使得系统无法正常关机。为解决此问题，可以按照以下方法授予系统自动关机权限。 手工操作 点击「开始菜单」，搜索「Regedit」，进入注册表编辑器。 打开窗口后，向注册表上方菜单输入路径 计算机\\\\HKEY_CURRENT_USER\\\\Control ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://pic3.zhimg.com/v2-c643b9737b35f9dd9a8382c5653e3d3e_r.jpg"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-02-26T17:51:54.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"电脑关机了，第二天一看确又开着的？让系统正常关机！"}],["meta",{"property":"article:author","content":"清顺"}],["meta",{"property":"article:tag","content":"关机"}],["meta",{"property":"article:published_time","content":"2017-09-02T00:38:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-02-26T17:51:54.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"电脑关机了，第二天一看确又开着的？让系统正常关机！\\",\\"image\\":[\\"https://pic3.zhimg.com/v2-c643b9737b35f9dd9a8382c5653e3d3e_r.jpg\\",\\"https://pic4.zhimg.com/v2-4b736585b25509b036935a2f9c37d843_r.jpg\\",\\"https://pic4.zhimg.com/v2-46fafee0cb6e212e793fc80268ab0917_r.jpg\\"],\\"datePublished\\":\\"2017-09-02T00:38:00.000Z\\",\\"dateModified\\":\\"2024-02-26T17:51:54.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"清顺\\",\\"url\\":\\"https://newzone.top\\"}]}"]]},"headers":[{"level":2,"title":"手工操作","slug":"手工操作","link":"#手工操作","children":[]},{"level":2,"title":"通过脚本修改","slug":"通过脚本修改","link":"#通过脚本修改","children":[{"level":3,"title":"注册表脚本修改","slug":"注册表脚本修改","link":"#注册表脚本修改","children":[]},{"level":3,"title":"cmd 修改","slug":"cmd-修改","link":"#cmd-修改","children":[]},{"level":3,"title":"PowerShell 修改","slug":"powershell-修改","link":"#powershell-修改","children":[]}]}],"git":{"createdTime":1708969914000,"updatedTime":1708969914000,"contributors":[{"name":"HansonXHC","email":"107744279+HansonXHC@users.noreply.github.com","commits":1}]},"readingTime":{"minutes":2.65,"words":794},"filePathRelative":"_posts/2017-09-02-forced_shutdown.md","localizedDate":"2017年9月2日","excerpt":"<p>晚上明明按下电脑的关机键，第二天早上却发现电脑开了一晚上？这是因为后台和 GUI 应用程序在阻止或取消关机，使得系统无法正常关机。为解决此问题，可以按照以下方法授予系统自动关机权限。</p>\\n<h2>手工操作</h2>\\n<ol>\\n<li>\\n<p>点击「开始菜单」，搜索「Regedit」，进入注册表编辑器。</p>\\n</li>\\n<li>\\n<p>打开窗口后，向注册表上方菜单输入路径 <code>计算机\\\\HKEY_CURRENT_USER\\\\Control Panel\\\\Desktop</code>。</p>\\n</li>\\n<li>\\n<p>在右侧窗格中找到 <code>AutoEndTasks</code> 键值。若不存在，则新建一个名为 <code>AutoEndTasks</code> 的「字符串值」，并将键值的数值设为 <code>1</code>。AutoEndTasks 表示自动结束失去响应的程序任务。<code>0</code> 表示 false（默认值），而 <code>1</code> 表示 true，电脑会自动结束失去响应的程序。</p>\\n<figure><img src=\\"https://pic3.zhimg.com/v2-c643b9737b35f9dd9a8382c5653e3d3e_r.jpg\\" alt=\\"\\" tabindex=\\"0\\" loading=\\"lazy\\"><figcaption></figcaption></figure>\\n</li>\\n<li>\\n<p>查找或创建 <code>WaitToKillAppTimeout</code> 字符串值，并设定其数值为 2000。2000 以毫秒计，表示在程序失去响应后，系统将等待 2 秒后自动结束相应程序。</p>\\n</li>\\n</ol>","autoDesc":true}')}}]);