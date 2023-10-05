/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	StripeCheckoutDataInput:{

	},
	CustomerInput:{

	},
	FileServerCredentials: `scalar.FileServerCredentials` as const,
	CheckoutDataInput:{
		customer:"CustomerInput",
		vat:"VatInput"
	},
	TeamEnabledFailureStatus: "enum" as const,
	RFC3339Date: `scalar.RFC3339Date` as const,
	MarketplaceProjectsSortInput:{
		team:"SortOrder",
		createdAt:"SortOrder",
		name:"SortOrder",
		id:"SortOrder",
		owner:"SortOrder",
		public:"SortOrder",
		slug:"SortOrder",
		tags:"SortOrder"
	},
	RenameFileInput:{

	},
	MarketplaceOps:{
		addProject:{
			opts:"AddProjectInput"
		},
		removeProject:{

		}
	},
	TeamOps:{
		addMember:{
			role:"Role"
		},
		createProject:{

		},
		createServiceAccount:{
			input:"CreateServiceAccountInput"
		},
		createServiceAccountApiKey:{

		},
		inviteToken:{
			role:"Role"
		},
		member:{

		},
		members:{

		},
		project:{

		},
		removeServiceAccount:{

		},
		removeServiceAccountApiKey:{

		},
		removeToken:{

		}
	},
	VatInput:{

	},
	Mutation:{
		changePassword:{

		},
		changeSubscription:{
			in:"ChangeSubscriptionInput"
		},
		consumeInviteToken:{

		},
		createTeam:{

		},
		createUser:{

		},
		deployToFaker:{

		},
		removeProject:{

		},
		sync:{

		},
		team:{

		},
		updateProject:{
			in:"UpdateProject"
		},
		updateSources:{
			sources:"NewSource"
		}
	},
	MemberOps:{
		update:{
			role:"Role"
		}
	},
	ChangeSubscriptionInput:{

	},
	Namespace:{
		project:{

		},
		projects:{

		}
	},
	Role: "enum" as const,
	Marketplace:{
		projects:{
			sort:"MarketplaceProjectsSortInput"
		}
	},
	Team:{
		member:{

		},
		members:{

		},
		serviceAccounts:{

		}
	},
	PaymentDate: `scalar.PaymentDate` as const,
	NpmRegistryPackageInput:{

	},
	Project:{
		members:{

		},
		sources:{

		}
	},
	ProjectsSortInput:{
		owner:"SortOrder",
		public:"SortOrder",
		slug:"SortOrder",
		tags:"SortOrder",
		team:"SortOrder",
		createdAt:"SortOrder",
		name:"SortOrder",
		id:"SortOrder"
	},
	SortOrder: "enum" as const,
	UpdateProject:{

	},
	AddProjectInput:{
		npmRegistryPackage:"NpmRegistryPackageInput"
	},
	Query:{
		checkoutData:{
			data:"CheckoutDataInput"
		},
		exchangeServiceAccountKey:{

		},
		fileServerCredentials:{

		},
		findProjects:{

		},
		findProjectsByTag:{

		},
		generateStripeBillingPortal:{

		},
		getAiRespond:{

		},
		getNamespace:{

		},
		getProject:{

		},
		getTeam:{

		},
		getUser:{

		},
		listProjects:{
			sort:"ProjectsSortInput"
		},
		myTeams:{

		},
		predictCheckout:{
			data:"PredictCheckoutInput"
		},
		stripePaymentLink:{
			data:"StripeCheckoutDataInput"
		}
	},
	Decimal: `scalar.Decimal` as const,
	PredictCheckoutInput:{

	},
	ProjectOps:{
		addMember:{
			role:"Role"
		},
		createTemporaryFile:{

		},
		removeSources:{

		},
		renameSources:{
			files:"RenameFileInput"
		},
		update:{
			in:"UpdateProject"
		}
	},
	AccountType: "enum" as const,
	CreateServiceAccountInput:{

	},
	NewSource:{

	}
}

export const ReturnTypes: Record<string,any> = {
	ServiceAccount:{
		description:"String",
		keys:"ServiceAccountApiKey",
		name:"String",
		tags:"String"
	},
	MarketplaceItemConnection:{
		pageInfo:"PageInfo",
		projects:"MarketplaceItem"
	},
	FakerSource:{
		checksum:"String",
		contents:"String",
		filename:"String",
		getUrl:"String",
		updatedAt:"String"
	},
	Endpoint:{
		uri:"String"
	},
	NpmRegistryPackage:{
		package:"String",
		registry:"String"
	},
	FileServerCredentials: `scalar.FileServerCredentials` as const,
	FakerSourceConnection:{
		pageInfo:"PageInfo",
		sources:"FakerSource"
	},
	Subscription:{
		cancelURL:"String",
		expiration:"String",
		quantity:"Int",
		seats:"UserConnection",
		status:"String",
		subscriptionID:"Int",
		subscriptionPlanID:"Int",
		updateURL:"String"
	},
	RFC3339Date: `scalar.RFC3339Date` as const,
	MarketplaceOps:{
		addProject:"Boolean",
		removeProject:"Boolean"
	},
	PageInfo:{
		last:"String",
		limit:"Int",
		next:"Boolean"
	},
	TeamOps:{
		addMember:"Member",
		createProject:"Project",
		createServiceAccount:"ServiceAccount",
		createServiceAccountApiKey:"ServiceAccountApiKey",
		delete:"Boolean",
		id:"ID",
		inviteToken:"String",
		member:"MemberOps",
		members:"MemberConnection",
		name:"String",
		namespace:"Namespace",
		planID:"Int",
		project:"ProjectOps",
		removeServiceAccount:"Boolean",
		removeServiceAccountApiKey:"Boolean",
		removeToken:"String"
	},
	TemporaryFile:{
		getUrl:"String",
		putUrl:"String"
	},
	MarketplaceUpstream:{
		"...on NpmRegistryPackage":"NpmRegistryPackage"
	},
	Mutation:{
		changePassword:"Boolean",
		changeSubscription:"Boolean",
		consumeInviteToken:"Boolean",
		createTeam:"TeamOps",
		createUser:"User",
		deleteAccount:"Boolean",
		deployToFaker:"Boolean",
		marketplace:"MarketplaceOps",
		removeProject:"Boolean",
		resendVerificationEmail:"Boolean",
		sync:"Boolean",
		team:"TeamOps",
		updateProject:"Boolean",
		updateSources:"SourceUploadInfo"
	},
	TeamConnection:{
		pageInfo:"PageInfo",
		teams:"Team"
	},
	MemberOps:{
		delete:"Boolean",
		update:"Boolean"
	},
	Header:{
		key:"String",
		value:"String"
	},
	Namespace:{
		project:"Project",
		projects:"ProjectConnection",
		public:"Boolean",
		slug:"String"
	},
	Marketplace:{
		projects:"MarketplaceItemConnection"
	},
	SourceUploadInfo:{
		filename:"String",
		headers:"Header",
		putUrl:"String"
	},
	Team:{
		enabled:"TeamEnabled",
		id:"ID",
		member:"Member",
		members:"MemberConnection",
		name:"String",
		namespace:"Namespace",
		planID:"Int",
		serviceAccounts:"ServiceAccountConnection",
		tokens:"InviteToken"
	},
	MarketplaceItem:{
		project:"Project",
		upstream:"MarketplaceUpstream"
	},
	PredictCheckout:{
		price:"Float",
		trialDays:"Int"
	},
	PaymentDate: `scalar.PaymentDate` as const,
	SubscriptionConnection:{
		pageInfo:"PageInfo",
		subscriptions:"Subscription"
	},
	ProjectConnection:{
		pageInfo:"PageInfo",
		projects:"Project"
	},
	Payment:{
		amount:"Decimal",
		currency:"String",
		date:"PaymentDate",
		receiptURL:"String",
		subscriptionID:"Int"
	},
	Project:{
		createdAt:"RFC3339Date",
		dbConnection:"String",
		description:"String",
		enabled:"Boolean",
		endpoint:"Endpoint",
		id:"ID",
		inCloud:"Boolean",
		members:"MemberConnection",
		mocked:"Boolean",
		name:"String",
		owner:"User",
		public:"Boolean",
		slug:"String",
		sources:"FakerSourceConnection",
		tags:"String",
		team:"Team",
		updatedAt:"RFC3339Date",
		upstream:"String"
	},
	ServiceAccountApiKey:{
		id:"String",
		key:"String",
		name:"String"
	},
	InviteToken:{
		createdAt:"String",
		domain:"String",
		expiration:"String",
		name:"String",
		removed:"Boolean",
		role:"Role",
		token:"String"
	},
	Query:{
		checkoutData:"String",
		emailVerified:"Boolean",
		exchangeServiceAccountKey:"String",
		fileServerCredentials:"FileServerCredentials",
		findProjects:"ProjectConnection",
		findProjectsByTag:"ProjectConnection",
		generateStripeBillingPortal:"String",
		getAiRespond:"String",
		getNamespace:"Namespace",
		getProject:"Project",
		getTeam:"Team",
		getUser:"User",
		listProjects:"ProjectConnection",
		marketplace:"Marketplace",
		myTeams:"TeamConnection",
		payments:"Payment",
		predictCheckout:"PredictCheckout",
		stripePaymentLink:"String"
	},
	UserConnection:{
		pageInfo:"PageInfo",
		users:"User"
	},
	TeamEnabled:{
		enabled:"Boolean",
		status:"TeamEnabledFailureStatus"
	},
	Decimal: `scalar.Decimal` as const,
	ServiceAccountConnection:{
		pageInfo:"PageInfo",
		serviceAccounts:"ServiceAccount"
	},
	ProjectOps:{
		addMember:"Member",
		createTemporaryFile:"TemporaryFile",
		delete:"Boolean",
		deployToFaker:"Boolean",
		removeSources:"Boolean",
		renameSources:"Boolean",
		update:"Boolean"
	},
	MemberConnection:{
		members:"Member",
		pageInfo:"PageInfo"
	},
	Member:{
		email:"String",
		role:"Role",
		serviceAccount:"Boolean",
		username:"String"
	},
	User:{
		accountType:"AccountType",
		consentGiven:"Boolean",
		consentTimestamp:"Int",
		id:"ID",
		namespace:"Namespace",
		stripeCustomerId:"ID",
		subscriptions:"SubscriptionConnection",
		username:"String"
	}
}

export const Ops = {
query: "Query" as const,
	mutation: "Mutation" as const
}