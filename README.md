# Repository Archival
### Due to Riot's transition from summoner names to Riot ID's this tool is no longer beneficial. See the relavant article here:
                                            https://www.riotgames.com/en/news/summoner-name-riot-ID
 
 
 
 # JDSS

JDSS is a program that allows the user to change an accounts League of Legends summoner name to a newly decayed summoner name.

# How it works

This program works based on League of Legends summoner name decay rules which are outlined here: https://support-leagueoflegends.riotgames.com/hc/en-us/articles/201751914
More specifically, JDSS uses NamesLoL.com's API to retrieve timing information on summoners with decaying names. Based on this timing information the program will attempt to change the user-input accounts' summoner names to the desired decaying name.
Here is the general flow of how the name change process goes:

- You add x number of accounts either via the Add Account button or the account import option.
- You go to the tasks page and find a name you want to snipe, and create the task.
- NamesLoL gives an exact second the name becomes available, but it is not the actual exact time the name will become available. It is just a rounded number that is correct most of the time based on certain factors. EX: changing a summoner icon will update the time on NamesLoL, but will not affect the decay.
- Once the time comes where the name should become available, JDSS will use every account you have added to the accounts page and stagger their name change requests (5 per account) throughout the duration of the Time Offset option. (more accounts = less time between requests = higher probability of success)

# Issues and Warnings

1. :warning: When adding accounts make sure not add them too fast or you will exceed League of Legends login rate limit. This will cause your IP to be timed out for 1 hour. If you're using the account import via options, do not try and log into any accounts manually during the time period it is running. This will cause you to be rate limited.

2. As mentioned above in how the program works, NamesLoL uses RiotGames API to retrieve an accounts revisionDate which is: "Date summoner was last modified specified as epoch milliseconds. The following events will update this timestamp: summoner name change, summoner level change, or profile icon change." Along with this, the revision date updates when a game is completed. Decay timing is based on the last time a game was played. If no game has been played, but an account changes the profile icon, it will cause NamesLoL to have incorrect decay timing.

3. Similar to Issue #2, The revisionDate for an account is a number rounded to the nearest second. I'm sure there is some decay timestamp that has actual millisecond accuracy, but I was unable to find it listed on any accessible API. So the best this program can do is send many requests over the potential rounded time period which is why the Time Offset option exists. If you have few accounts I've found most names become available ~300ms earlier than the NamesLoL time, and almost never after. So setting Time Offset to -350, 0 would be beneficial.

4. :warning: :warning: Because of the way this program sends many name change requests in a short timespan, its possible (going to happen if you have a lot of accounts) for multiple accounts ( :warning: **up to 5 accounts will lose BE** :warning: ) in your account list to spend currency on a name change purchase, but only one account will ever get the name. I'm not sure why this is even able to happen, I guess some issue with League of Legends name change API.


# Example Images

<p align="center">
    <img src="https://github.com/MulliganJohn/JDSS/blob/main/Example_Images/JDSS_Accounts.png?raw=true" alt="The JDSS Account Page."/>
</p>

<p align="center">
    Figure 1: This is the accounts page for JDSS. You can add a new account by clicking the "Add Account" button which will open a new login window page.
</p>

<p align="center">
    <img src="https://github.com/MulliganJohn/JDSS/blob/main/Example_Images/JDSS_Tasks.png?raw=true" alt="The JDSS Tasks Page."/>
</p>

<p align="center">
    Figure 2: This is the Tasks page for JDSS. You can add a new task by clicking the "Add Task" button which will open a new task window page. Once a task is added it will appear in the task table, and the status column will show the status of the task. Green = Task completed successfully (One of your accounts summoner name was changed to the desired name) Yellow = The task is still in progress (The name is not yet available) Red = The task failed (None of your accounts summoner names were changed to the desired name)
</p>

<p align="center" >
  <img src="https://github.com/MulliganJohn/JDSS/blob/main/Example_Images/JDSS_Options.png?raw=true" alt="The JDSS Options Page."/>
</p>

<p align="center">
    Figure 3: This is the Options page for JDSS. Information about the options are provided under the "Options" header below.
</p>

<p align="center">
    <img src="https://github.com/MulliganJohn/JDSS/blob/main/Example_Images/JDSS_Login_Task.png?raw=true" alt="The JDSS Login and Task Windows."/>
</p>

<p align="center">
    Figure 4: These photos show the login window, and the task window that appear when clicking the "Add Account" or "Add Task" buttons. From left to right, the Login Window Page, the Task Window Page, and the Task Window Confirmation Page.
</p>

# Options

### Import Accounts

This option is to prevent the user from having to manually add an excessive number of accounts. For this option input, you need to provide an absolute path to a text document containing your accounts. This text document must be formatted with user:pass and one for each line. No trailing spaces either.


### Time Offset

This option allows the user to change the time offset for name changes. If the task availability is at 6:00:00:000 PM then a value of -500, 500 (default) will stagger the name change requests from all of your accounts across 5:59:59:500 - 6:00:00:500. You can calculate the time between requests by doing (offsetStop - offsetStart) / (numAccounts * 5). The lower this number is, then the higher probability of having multiple accounts waste BE on the name change based on the [issue / warning #4](https://github.com/MulliganJohn/JDSS#issues-and-warnings). At around 10-15ms you may get up to 5 accounts spending their BE. I figure around ~50ms this may improve.

# How to run JDSS?

To run this program you can either download the portable executable files in the releases section or you can build and compile this program yourself. I am on a windows operating system, so with the code opened in VSCode you can use the script `npm run electron:package:win` for a windows executable which will appear in the ./dist directory.
