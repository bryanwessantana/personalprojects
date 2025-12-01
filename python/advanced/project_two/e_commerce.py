# Minimal E-commerce System (Cart and Checkout):

# Python/DB: Shopping cart logic (add/remove/update items), 
# subtotal calculation, and simplified checkout. Requires complex 
# data models (products, orders, order items).

# Front-end: Product pages, a persistent cart, and a checkout form.

# ------------------------------------------------------------------------------------------- #
import sys

# Simulação de Catálogo de Produtos
CATALOG = {
    101: {"name": "Python Book", "price": 45.99},
    102: {"name": "Flask Ebook", "price": 29.50},
    103: {"name": "Webcam", "price": 120.00},
    104: {"name": "Custom Mousepad", "price": 15.00}
}

class ShoppingCart:
    """Represents the shopping cart and its logic."""
    def __init__(self):
        # The cart stores {product_id: quantity}
        self.items = {}

    def add_item(self, product_id, quantity=1):
        """Adds or updates the quantity of an item in the cart."""
        if product_id not in CATALOG:
            print(f"❌ Error: Product ID {product_id} not found in catalog.")
            return

        if product_id in self.items:
            self.items[product_id] += quantity
        else:
            self.items[product_id] = quantity
        
        print(f"✅ Added: {quantity}x {CATALOG[product_id]['name']}")

    def remove_item(self, product_id, quantity=1):
        """Removes a quantity of an item from the cart."""
        if product_id not in self.items:
            print(f"❌ Error: Product ID {product_id} is not in the cart.")
            return

        self.items[product_id] -= quantity
        if self.items[product_id] <= 0:
            del self.items[product_id]
            print(f"🗑️ Fully removed: {CATALOG[product_id]['name']}")
        else:
            print(f"➖ Removed: {quantity}x {CATALOG[product_id]['name']}")

    def calculate_total(self):
        """Calculates the subtotal of all items in the cart."""
        subtotal = 0
        for product_id, quantity in self.items.items():
            price = CATALOG[product_id]['price']
            subtotal += price * quantity
        return subtotal

    def checkout(self):
        """Finalizes the purchase and displays the transaction summary."""
        if not self.items:
            print("\n❌ Cart is empty. Add items before checking out.")
            return False

        total = self.calculate_total()
        shipping_fee = 15.00 # Simulated fixed shipping fee
        final_total = total + shipping_fee

        print("\n--- CHECKOUT SUMMARY ---")
        for product_id, quantity in self.items.items():
            product = CATALOG[product_id]
            line_total = product['price'] * quantity
            print(f" {quantity}x {product['name']}: R$ {line_total:.2f}")

        print("\n Subtotal:   R$ {:7.2f}".format(total))
        print(" Shipping:   R$ {:7.2f}".format(shipping_fee))
        print("---------------------------")
        print(" FINAL TOTAL: R$ {:7.2f}".format(final_total))
        print("---------------------------\n")
        
        self.items = {} # Clears the cart after checkout
        print("🎉 Purchase completed successfully!")
        return True
        
    def display_cart(self):
        """Displays the current contents of the cart."""
        if not self.items:
            print("\n🛒 Cart is empty.")
            return
            
        print("\n--- CART CONTENTS ---")
        for product_id, quantity in self.items.items():
            product = CATALOG[product_id]
            print(f"ID: {product_id} | {quantity}x {product['name']} @ R$ {product['price']:.2f}")
        print("----------------------------")


def display_catalog():
    """Displays the product catalog in the terminal."""
    print("\n--- PRODUCT CATALOG ---")
    print(f"{'ID':<5} | {'Name':<25} | {'Price':<8}")
    print("-" * 45)
    for id, item in CATALOG.items():
        print(f"{id:<5} | {item['name']:<25} | R$ {item['price']:<8.2f}")
    print("-" * 45)

def run_cli():
    cart = ShoppingCart()
    
    while True:
        print("\nACTION MENU:")
        print("1. View Catalog")
        print("2. Add Item")
        print("3. View Cart")
        print("4. Checkout")
        print("5. Remove Item")
        print("0. Exit")
        
        choice = input("Select an option: ").strip()
        
        if choice == '1':
            display_catalog()
            
        elif choice == '2':
            try:
                product_id = int(input("Enter Product ID: "))
                # Use a separate input for quantity, defaulting to 1 if blank
                quantity_input = input("Enter quantity (default: 1): ")
                quantity = int(quantity_input) if quantity_input else 1
                
                # Basic check to ensure quantity is positive
                if quantity <= 0:
                    print("Quantity must be a positive integer.")
                else:
                    cart.add_item(product_id, quantity)
            except ValueError:
                print("Invalid input. Please enter integers.")
            
        elif choice == '3':
            cart.display_cart()
            
        elif choice == '4':
            cart.checkout()
            
        elif choice == '5':
            try:
                product_id = int(input("Enter Product ID to remove: "))
                # Use a separate input for quantity, defaulting to 1 if blank
                quantity_input = input("Enter quantity to remove (default: 1): ")
                quantity = int(quantity_input) if quantity_input else 1
                
                if quantity <= 0:
                     print("Quantity must be a positive integer.")
                else:
                    cart.remove_item(product_id, quantity)
            except ValueError:
                print("Invalid input. Please enter integers.")
                
        elif choice == '0':
            print("Exiting E-commerce system...")
            break
        else:
            print("Invalid option.")

if __name__ == '__main__':
    run_cli()