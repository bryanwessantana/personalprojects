# Custom RSS/News Reader:

# Python: Parses an RSS feed from a news site (using feedparser, 
# for example) and stores the latest headlines and links in the DB.

# Front-end: Lists the news headlines with links and perhaps a 
# small summary.

# ------------------------------------------------------------------------------------------- #
import feedparser
import textwrap
import sys

# Lista de feeds RSS populares para teste
RSS_FEEDS = {
    "BBC Technology": "http://feeds.bbci.co.uk/news/technology/rss.xml",
    "NY Times World": "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    "NASA Image of the Day": "https://www.nasa.gov/rss/dyn/lg_image_of_the_day.rss",
    "Reddit Python": "https://www.reddit.com/r/Python/.rss"
}

def fetch_feed(url):
    """Busca e faz o parse do feed RSS."""
    print(f"Fetching data from: {url} ...")
    feed = feedparser.parse(url)
    
    if feed.bozo: # 'bozo' é 1 se houver erro de formatação XML, mas tenta ler mesmo assim
        print("Warning: This feed might be malformed, but we'll try to read it.")
    
    return feed

def display_feed(feed):
    """Exibe as entradas do feed formatadas."""
    print(f"\n📰 FEED: {feed.feed.get('title', 'Unknown Title')}")
    print(f"🔗 Link: {feed.feed.get('link', 'No link')}")
    print(f"📝 Description: {feed.feed.get('description', 'No description')}")
    print("=" * 60 + "\n")

    for entry in feed.entries[:5]: # Mostra apenas as 5 primeiras notícias
        print(f"🔹 {entry.title}")
        print(f"   Published: {entry.get('published', 'N/A')}")
        print(f"   Link: {entry.link}")
        
        # Limita o resumo a 150 caracteres para não poluir o terminal
        summary = entry.get('summary', '')
        if summary:
            # Remove tags HTML simples se houver (muito básico)
            clean_summary = summary.split('<')[0] 
            print(f"   Summary: {textwrap.shorten(clean_summary, width=150, placeholder='...')}")
        
        print("-" * 60)

def run_cli():
    print("\n📡 CUSTOM RSS READER (CLI) 📡")
    
    while True:
        print("\nChoose a feed to read:")
        feeds_list = list(RSS_FEEDS.keys())
        for i, name in enumerate(feeds_list, 1):
            print(f"{i}. {name}")
        print("0. Exit")
        
        choice = input("\nEnter number: ").strip()
        
        if choice == '0':
            print("Exiting...")
            break
            
        try:
            index = int(choice) - 1
            if 0 <= index < len(feeds_list):
                selected_feed_name = feeds_list[index]
                selected_url = RSS_FEEDS[selected_feed_name]
                
                feed_data = fetch_feed(selected_url)
                display_feed(feed_data)
                
                input("\nPress Enter to continue...")
            else:
                print("Invalid number.")
        except ValueError:
            print("Please enter a valid number.")

if __name__ == '__main__':
    # Lembre-se: pip install feedparser
    run_cli()